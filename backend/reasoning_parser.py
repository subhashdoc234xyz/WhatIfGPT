import re

def parse_reasoning_steps(raw_text: str):
    """
    Parse raw model output into structured reasoning steps.
    Expected format:
    Step 1: [content]
    Step 2: [content]
    ...
    Conclusion: [content]
    
    Returns a list of step dictionaries with id, stepText, and dependsOn.
    """
    steps = []
    
    # Pattern to match "Step N:" or "Conclusion:"
    step_pattern = r'(?:Step\s*(\d+):|Conclusion:)\s*(.+?)(?=(?:Step\s*\d+:|Conclusion:|$))'
    
    matches = re.findall(step_pattern, raw_text, re.DOTALL)
    
    if not matches:
        # If no structured steps found, treat the whole response as one step
        return [{
            "id": 1,
            "stepText": raw_text.strip(),
            "dependsOn": None,
            "isConclusion": False
        }]
    
    for i, match in enumerate(matches):
        step_num_or_empty, content = match
        
        if step_num_or_empty:
            step_id = int(step_num_or_empty)
            is_conclusion = False
        else:
            # This is a Conclusion line
            step_id = len(matches) + 1
            is_conclusion = True
        
        step_data = {
            "id": step_id,
            "stepText": content.strip(),
            "dependsOn": step_id - 1 if step_id > 1 else None,
            "isConclusion": is_conclusion
        }
        steps.append(step_data)
    
    return steps


def extract_conclusion(steps: list) -> str:
    """Extract the conclusion text from the last step."""
    if not steps:
        return ""
    return steps[-1].get("stepText", "")
