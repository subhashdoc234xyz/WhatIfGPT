# WhatIfGPT

**Tagline:** Don't just read gpt-oss's reasoning — fork it, edit it, and watch the answer change.

An interactive reasoning explorer that turns AI chain-of-thought into an editable, explorable tree. Every reasoning step becomes a node you can click, edit, and fork to see how different assumptions lead to different conclusions.

## Features

✨ **Interactive Reasoning Tree** - Visualize AI reasoning as a navigable graph  
🔀 **Fork & Edit** - Click any step, change an assumption, create a new branch  
📊 **Branch Comparison** - Compare different reasoning paths side-by-side  
🎨 **Glassmorphism UI** - Beautiful, modern interface with frosted glass effects  

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + React Flow
- **Backend:** FastAPI (Python)
- **LLM Inference:** Groq API (gpt-oss compatible models)

## Getting Started

### Prerequisites

- Node.js 16+ 
- Python 3.9+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd WhatIfGPT
```

#### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your API key
echo "GROQ_API_KEY=your_key_here" > .env

# Start the backend server
uvicorn main:app --reload --port 8000
```

#### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. **Enter a Question** - Type a problem or decision you want to explore (e.g., "Should I launch this product in Q1 or Q2?")

2. **View Reasoning Tree** - The AI breaks down its reasoning into numbered steps displayed as an interactive tree

3. **Edit & Fork** - Click any step to edit its assumption. Save to create a new branch with altered reasoning

4. **Compare Branches** - Select two branches to see how different assumptions led to different conclusions

## Example Prompts

Try these to see the tool's capabilities:

- **"Should I launch this product in Q1 or Q2?"** - Explore timing trade-offs
- **"Is it better to rent or buy a home?"** - Compare financial decisions
- **"Should I accept this job offer?"** - Analyze career choices
- **"What's the best approach to learn programming?"** - Examine learning strategies

## API Endpoints

- `POST /api/generate` - Generate initial reasoning from a prompt
- `POST /api/fork` - Create a new branch by editing a step
- `POST /api/compare` - Compare two reasoning branches
- `GET /api/health` - Health check endpoint

## Project Structure

```
WhatIfGPT/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── gpt_oss_client.py    # Groq API wrapper
│   ├── reasoning_parser.py  # Parse model output into steps
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── PromptInput.jsx
│   │   │   ├── ReasoningTree.jsx
│   │   │   ├── NodeEditor.jsx
│   │   │   └── BranchCompare.jsx
│   │   ├── App.jsx          # Main application
│   │   └── index.css        # Glassmorphism styles
│   └── package.json
├── .env.example
├── README.md
└── LICENSE
```

## Deployment

### Backend (Render/Railway)

1. Deploy the `backend` folder
2. Set `GROQ_API_KEY` environment variable
3. Configure CORS for your frontend domain

### Frontend (Vercel/Netlify)

1. Build with `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your backend URL

## License

MIT License - feel free to use this for your hackathon or personal projects!

## Hackathon Submission

This project was built for the OpenAI Open Model Hackathon in the **Best Overall / Wildcard** category. It showcases gpt-oss's exposed chain-of-thought in a way closed models can't support, reframing "reasoning" as something explorable and editable rather than a static wall of text.

---

Made with ✨ during the OpenAI Open Model Hackathon
