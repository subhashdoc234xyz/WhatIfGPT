from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid

from gpt_oss_client import (
    generate_reasoning,
    compare_branches,
    generate_next_suggestions,
    generate_final_conclusion
)
from reasoning_parser import parse_reasoning_steps, extract_conclusion

class SuggestionsRequest(BaseModel):
    prompt: str
    steps: List[Dict[str, Any]]

class FinishRequest(BaseModel):
    prompt: str
    steps: List[Dict[str, Any]]

app = FastAPI(title="WhatIfGPT API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str
    previous_steps: Optional[List[Dict[str, Any]]] = None


class ForkRequest(BaseModel):
    prompt: str
    edited_step: Dict[str, Any]
    steps_before_edit: List[Dict[str, Any]]


class CompareRequest(BaseModel):
    branch1_steps: List[Dict[str, Any]]
    branch1_conclusion: str
    branch2_steps: List[Dict[str, Any]]
    branch2_conclusion: str


@app.post("/api/generate")
async def generate_reasoning_endpoint(request: PromptRequest):
    """Generate initial reasoning steps from a prompt."""
    try:
        raw_response = generate_reasoning(
            prompt=request.prompt,
            previous_steps=request.previous_steps
        )
        steps = parse_reasoning_steps(raw_response)
        # Strip the conclusion step so the user can build on it and click 'Finish' manually
        steps = [s for s in steps if not s.get("isConclusion")]
        
        return {
            "steps": steps,
            "conclusion": "",
            "rawResponse": raw_response
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/fork")
async def fork_reasoning_endpoint(request: ForkRequest):
    """Create a new branch by editing a step and continuing reasoning."""
    try:
        # Build the context up to the edited step
        context_steps = request.steps_before_edit.copy()
        
        # Replace or add the edited step
        edited_step = request.edited_step
        if edited_step.get("id"):
            # Find and replace the step
            for i, step in enumerate(context_steps):
                if step["id"] == edited_step["id"]:
                    context_steps[i] = edited_step
                    break
        else:
            # New step at the end
            new_id = max([s["id"] for s in context_steps], default=0) + 1
            edited_step["id"] = new_id
            context_steps.append(edited_step)
        
        # Continue reasoning from the edited step
        raw_response = generate_reasoning(
            prompt=request.prompt,
            previous_steps=context_steps
        )
        
        # Parse new steps (these will be the continuation)
        new_steps = parse_reasoning_steps(raw_response)
        # Strip conclusion steps to keep the path open for suggestions
        new_steps = [s for s in new_steps if not s.get("isConclusion")]
        
        # Adjust IDs to avoid conflicts
        max_existing_id = max([s["id"] for s in context_steps], default=0)
        for step in new_steps:
            step["id"] = max_existing_id + step["id"]
            if step["dependsOn"]:
                step["dependsOn"] = max_existing_id + step["dependsOn"]
        
        # Combine context steps with new steps
        all_steps = context_steps + new_steps
        
        return {
            "steps": all_steps,
            "conclusion": "",
            "newSteps": new_steps,
            "rawResponse": raw_response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/compare")
async def compare_branches_endpoint(request: CompareRequest):
    """Compare two reasoning branches and explain differences."""
    try:
        comparison = compare_branches(
            request.branch1_steps,
            request.branch1_conclusion,
            request.branch2_steps,
            request.branch2_conclusion
        )
        return {"comparison": comparison}
    except Exception as e:

@app.post("/api/suggestions")
async def suggestions_endpoint(request: SuggestionsRequest):
    """Generate 3 alternative next reasoning steps."""
    try:
        options = generate_next_suggestions(
            prompt=request.prompt,
            steps=request.steps
        )
        return {"suggestions": options}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/finish")
async def finish_endpoint(request: FinishRequest):
    """Synthesize all steps into a final conclusion."""
    try:
        conclusion = generate_final_conclusion(
            prompt=request.prompt,
            steps=request.steps
        )
        return {"conclusion": conclusion}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    import os
    from dotenv import load_dotenv
    # Load .env from root directory if running from backend folder
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))
    # Default to 8000 since frontend defaults to 8000
    port = int(os.getenv("PORT", 8000))
    print(f"Starting server on port {port}...")
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)

