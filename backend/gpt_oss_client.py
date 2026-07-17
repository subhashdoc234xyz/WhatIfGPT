import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_reasoning(prompt: str, system_prompt: str = None, previous_steps: list = None):
    """
    Generate reasoning steps using gpt-oss via Groq API.
    Returns the raw response text which will be parsed into steps.
    """
    if system_prompt is None:
        system_prompt = """You are a reasoning assistant that breaks down problems into clear, numbered steps.
Each step should be a distinct assumption, observation, or logical deduction.
Format your response as:
Step 1: [content]
Step 2: [content]
Step 3: [content]
...
Conclusion: [final answer]

Be explicit about assumptions and trade-offs."""

    messages = [
        {"role": "system", "content": system_prompt}
    ]
    
    if previous_steps:
        # Continue from previous steps
        context = "Previous reasoning steps:\n"
        for step in previous_steps:
            context += f"Step {step['id']}: {step['stepText']}\n"
        context += f"\nOriginal question: {prompt}\n\nContinue reasoning from here:"
        messages.append({"role": "user", "content": context})
    else:
        messages.append({"role": "user", "content": prompt})
    
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",  # Using available model on Groq
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"API Error: {str(e)}")


def compare_branches(branch1_steps: list, branch1_conclusion: str, 
                     branch2_steps: list, branch2_conclusion: str) -> str:
    """
    Ask the model to summarize the differences between two reasoning branches.
    """
    prompt = f"""Compare these two reasoning paths and their conclusions:

Branch 1:
{chr(10).join([f"Step {s['id']}: {s['stepText']}" for s in branch1_steps])}
Conclusion: {branch1_conclusion}

Branch 2:
{chr(10).join([f"Step {s['id']}: {s['stepText']}" for s in branch2_steps])}
Conclusion: {branch2_conclusion}

Explain the key differences in assumptions and how they led to different conclusions."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"API Error: {str(e)}")


import re

def generate_next_suggestions(prompt: str, steps: list) -> list:
    """
    Generate 3 alternative next steps based on the current reasoning path.
    """
    context = "We are building a step-by-step reasoning tree. Here is the progress so far:\n"
    context += f"Original Question: {prompt}\n\n"
    context += "Current Steps:\n"
    for step in steps:
        context += f"- Step {step['id']}: {step['stepText']}\n"
    
    context += "\nGenerate exactly 3 alternative/next steps that could follow this reasoning. Keep each option concise (1-2 sentences). Format your response EXACTLY as:\n"
    context += "Option 1: [content]\n"
    context += "Option 2: [content]\n"
    context += "Option 3: [content]"

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": context}],
            temperature=0.7,
            max_tokens=500
        )
        content = response.choices[0].message.content
        options = []
        # Parse out Option 1, Option 2, Option 3
        matches = re.findall(r'Option\s*\d+:\s*(.+?)(?=(?:Option\s*\d+:|$))', content, re.DOTALL)
        for match in matches:
            if match.strip():
                options.append(match.strip())
        
        # Fallback if parsing fails
        if len(options) < 3:
            lines = [line.replace("Option 1:", "").replace("Option 2:", "").replace("Option 3:", "").strip() for line in content.split("\n") if line.strip()]
            options = [line for line in lines if line][:3]
            
        return options[:3]
    except Exception as e:
        raise Exception(f"API Error: {str(e)}")


def generate_final_conclusion(prompt: str, steps: list) -> str:
    """
    Synthesize all steps into a final conclusion.
    """
    context = f"Original Question: {prompt}\n\n"
    context += "Reasoning Steps taken:\n"
    for step in steps:
        context += f"Step {step['id']}: {step['stepText']}\n"
    context += "\nBased on the reasoning above, write a comprehensive final output/conclusion that directly answers the original question."

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": context}],
            temperature=0.5,
            max_tokens=1000
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise Exception(f"API Error: {str(e)}")
