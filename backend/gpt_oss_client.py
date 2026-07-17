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
