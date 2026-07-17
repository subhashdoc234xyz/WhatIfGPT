# WhatIfGPT — Build Prompt

**Project name:** WhatIfGPT
**Tagline:** Don't just read gpt-oss's reasoning — fork it, edit it, and watch the answer change.
**Hackathon:** OpenAI Open Model Hackathon
**Category:** Best Overall / Wildcard

---

## The idea

Most chatbot UIs show a model's reasoning as a wall of collapsible text you skim once and forget. WhatIfGPT turns gpt-oss's chain-of-thought into an **interactive, explorable tree**. Every reasoning step becomes a node. Users can:

- Click any intermediate reasoning step
- **Edit the assumption at that step** (e.g. change "assume the budget is $10k" to "$50k")
- Re-run gpt-oss from that node forward, creating a **new branch** without losing the original
- Compare branches side-by-side to see how a changed assumption changes the conclusion

This is the "surprise us with something we haven't seen before" angle — it's not another chatbot, it's a reasoning-inspection and counterfactual-exploration tool built specifically around gpt-oss's exposed chain-of-thought, which most closed models don't give you access to.

Because it runs the model via a free cloud host instead of locally, it drops the "no internet" constraint and targets **Best Overall** (most interesting application of gpt-oss) or **Wildcard** (most unexpected use) instead of Best Local Agent.

---

## Build Prompt (paste into Jules / Antigravity / Claude Code / Cursor)

```
Build a project called "WhatIfGPT" — a web app that turns gpt-oss's chain-of-
thought reasoning into an interactive, editable tree, letting users fork the
model's reasoning at any step and re-run it with a changed assumption.

TECH STACK
- Frontend: React + Vite + Tailwind CSS
- Reasoning tree visualization: React Flow (or a custom SVG tree renderer)
- Backend: FastAPI (Python) or a Node/Express server
- LLM inference: gpt-oss-20b via Groq's free API (OpenAI-compatible endpoint,
  https://api.groq.com/openai/v1) — fallback option: OpenRouter's free gpt-oss
  endpoint. Use an env var GROQ_API_KEY, never hardcode it.
- No database required for MVP — keep tree state in React state / localStorage
  is fine here since there's no user auth (single-session tool)

CORE FEATURES
1. Prompt input: user asks a question or poses a problem (e.g. "Should I
   launch this product in Q1 or Q2?").
2. Reasoning generation: call gpt-oss with a system prompt that asks it to
   think in explicit, numbered steps (or use Groq's reasoning/thinking output
   if exposed). Parse the steps into a structured list:
   [{ id, stepText, dependsOn: previousStepId }]
3. Tree rendering: render each step as a node in a tree/graph (React Flow),
   connected in sequence, ending in a "Conclusion" node.
4. Fork interaction: clicking a node opens an edit panel where the user can
   rewrite that step's assumption/content. On save, re-send gpt-oss a prompt
   containing: original question + all steps up to (and including) the edited
   one + "continue reasoning from here." This produces a new branch, rendered
   as a sibling path diverging from that node.
5. Branch comparison: let users select two leaf/conclusion nodes and view
   them side-by-side with a short diff/explanation of why they differ
   (ask gpt-oss to summarize the difference between two conclusions given
   both reasoning paths).
6. Export: export a branch (or the full tree) as a shareable Markdown/PDF
   report showing the reasoning path and conclusion.

UI/UX
- Central canvas: pannable/zoomable tree (React Flow gives you this for free).
- Side panel: shows full text of the selected node, with an "Edit & Fork"
  button.
- Keep it visually clean — this is the star feature, so the tree needs to
  look good, not cluttered. Use distinct colors per branch.

NON-FUNCTIONAL REQUIREMENTS
- README.md with setup instructions, how to get a free Groq API key, and how
  to run locally.
- .env.example showing required env vars (GROQ_API_KEY).
- Include 2-3 example prompts in the README that showcase forking well
  (decisions with genuine trade-offs work best, e.g. business/technical
  decisions, planning problems, math word problems with an ambiguous
  assumption).
- License the repo under MIT or Apache-2.0.
- Add basic error handling for API rate limits / failures (Groq free tier
  has rate limits — show a friendly retry message).

DELIVERABLES FOR SUBMISSION
- Public GitHub repo with commit history showing work done during the
  hackathon submission window.
- README with testing instructions and example prompts to try.
- A <3 minute demo video showing: (1) asking a question, (2) the reasoning
  tree rendering, (3) forking a step with a changed assumption, (4) the new
  branch appearing, (5) side-by-side branch comparison.

Please scaffold the project with this structure:
/backend
  main.py (FastAPI app)
  gpt_oss_client.py (wrapper for Groq/OpenRouter chat calls)
  reasoning_parser.py (parses model output into structured steps)
/frontend
  src/components (ReasoningTree, NodeEditor, BranchCompare, PromptInput)
  src/App.jsx
.env.example
README.md
LICENSE
```

---

## Deployment

Since this version calls gpt-oss over a cloud API instead of running it locally, deployment is a normal web app — no offline packaging needed.

### 1. Get a free API key
- Sign up at [console.groq.com](https://console.groq.com) and grab a free API key (Groq hosts gpt-oss-20b/120b with generous free-tier rate limits, fast inference).
- Alternative: [openrouter.ai](https://openrouter.ai) also hosts free gpt-oss endpoints.

### 2. Local development
```bash
# backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "GROQ_API_KEY=your_key_here" > .env
uvicorn main:app --reload --port 8000

# frontend
cd frontend
npm install
npm run dev
```

### 3. Production deployment (matches your usual stack)
- **Backend:** deploy the FastAPI app to **Render** (same as your PersistIQ deployment) or Railway. Set `GROQ_API_KEY` as an environment variable in the dashboard — never commit it.
- **Frontend:** deploy the React/Vite build to **Vercel** (same as your Flashbot/HabitFlow deployments). Set `VITE_API_URL` to point at your Render backend URL.
- Enable CORS on the FastAPI backend for your Vercel domain.

### 4. For the submission
- Push the repo to public GitHub with a clear README (getting-started instructions + example prompts).
- Record the demo video showing the live deployed app (or local run) — walk through asking a question, forking a reasoning step, and comparing branches.
- In the Devpost submission text, explain the category fit: WhatIfGPT showcases gpt-oss's exposed chain-of-thought in a way closed models can't support, and reframes "reasoning" as something explorable and editable rather than a static wall of text.

---

