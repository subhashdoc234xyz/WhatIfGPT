import os
import time
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class GroqRequestError(Exception):
    """A safe, user-facing error raised when a Groq request cannot complete."""

    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


def _create_completion(**kwargs):
    """Run a Groq completion with consistent, friendly error handling."""
    if not os.getenv("GROQ_API_KEY"):
        raise GroqRequestError(
            "Groq API key is missing. Add GROQ_API_KEY to the backend environment and restart the server.",
            status_code=401,
        )

    max_retries = 3
    for attempt in range(max_retries + 1):
        try:
            return client.chat.completions.create(**kwargs)
        except Exception as error:
            status_code = getattr(error, "status_code", None)
            error_name = type(error).__name__

            if status_code in (401, 403):
                raise GroqRequestError(
                    "The Groq API key is invalid or does not have permission to use this model. Check GROQ_API_KEY and try again.",
                    status_code=401,
                ) from error

            if error_name == "APITimeoutError" or isinstance(error, TimeoutError):
                raise GroqRequestError(
                    "The AI service timed out before it could respond. Please try again.",
                    status_code=504,
                ) from error

            if status_code == 429:
                if attempt == max_retries:
                    raise GroqRequestError(
                        "The AI service is busy due to rate limits. Please wait a moment and try again.",
                        status_code=429,
                    ) from error

                # Retry rate limits up to three times with 1s, 2s, then 4s exponential backoff.
                time.sleep(2 ** attempt)
                continue

            raise GroqRequestError(
                "The AI service could not complete the request. Please try again shortly.",
                status_code=502,
            ) from error

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
    
    response = _create_completion(
        model="llama-3.3-70b-versatile",  # Using available model on Groq
        messages=messages,
        temperature=0.7,
        max_tokens=2000,
    )
    return response.choices[0].message.content


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

    response = _create_completion(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5,
        max_tokens=1000,
    )
    return response.choices[0].message.content


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

    response = _create_completion(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": context}],
        temperature=0.7,
        max_tokens=500,
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


def generate_final_conclusion(prompt: str, steps: list) -> str:
    """
    Synthesize all steps into a final conclusion.
    """
    context = f"Original Question: {prompt}\n\n"
    context += "Reasoning Steps taken:\n"
    for step in steps:
        context += f"Step {step['id']}: {step['stepText']}\n"
    context += "\nBased on the reasoning above, write a comprehensive final output/conclusion that directly answers the original question."

    response = _create_completion(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": context}],
        temperature=0.5,
        max_tokens=1000,
    )
    return response.choices[0].message.content.strip()
