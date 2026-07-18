<p align="center">
  <h1 align="center">WhatIfGPT</h1>
  <p align="center"><strong>Don't just read reasoning — fork it, edit it, and watch the answer change.</strong></p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?logo=python" alt="Python">
</p>

<br/>

<p align="center">
  <img src="./docs/thumbnail.png" alt="WhatIfGPT banner">
</p>

<!-- 
  📷 IMAGE PLACEHOLDER: Please add a banner image named 'thumbnail.png' to the /docs folder.
  This should be a sky-blue decision tree or similar visual that represents the project.
-->

WhatIfGPT is an interactive AI reasoning explorer that transforms LLM chain-of-thought into an editable, forkable tree. Unlike traditional chatbots that present reasoning as a static wall of text, WhatIfGPT lets you click into any step of the AI's reasoning, edit its assumptions, and instantly see how those changes ripple through to alter the final conclusion. It's built for deep exploration of complex decisions and was originally created for the OpenAI Open Model Hackathon (gpt-oss) and later extended for OpenAI Build Week (Codex + GPT-5.6).

## Features

- ✨ **Interactive Reasoning Tree** – Visualize AI reasoning as a navigable, interactive graph
- 🔀 **Fork & Edit Any Step** – Click any node, change an assumption, and create a new branch
- ⚡ **AI Next-Step Suggestions** – Get intelligent suggestions for what to explore next
- ⚖️ **Branch Comparison** – Compare different reasoning paths side-by-side
- 📄 **Dedicated Final Report View** – Clean, distraction-free document view of synthesized conclusions
- ✍️ **Premium Markdown Formatting** – Beautiful headings, bold text, lists in exported reports
- 📋 **One-Click Copy to Clipboard** – Export the entire report instantly
- 🎨 **Glassmorphism UI** – Modern frosted-glass interface with animated gradients

## Demo

<p align="center">
  <img src="./docs/screenshot-1.png" alt="App screenshot" width="800">
  <br/>
  <em>The WhatIfGPT interface showing a question being asked and the resulting reasoning tree. Click any node to fork and edit its content.</em>
</p>

<!-- 
  📷 IMAGE PLACEHOLDER: Please add a screenshot named 'screenshot-1.png' to the /docs folder.
  Capture the "Ask a Question" home screen or the reasoning tree in action.
-->

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, React Flow |
| Backend | FastAPI (Python) |
| LLM | gpt-oss via Groq API / GPT-5.6 via Codex |
| Styling | Custom glassmorphism CSS with backdrop blur |

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.9+
- A free Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/subhashdoc234xyz/WhatIfGPT.git
   cd WhatIfGPT
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   ```

3. **Install dependencies**

   ```bash
   # From root directory
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Run the application**

   **Terminal 1 – Backend:**
   ```bash
   cd backend
   uvicorn main:app --reload --port 8000
   ```

   **Terminal 2 – Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

   The app will be available at **http://localhost:5173**

## Usage

1. **Enter a Question** – Type a problem or decision you want to explore (e.g., "Should I launch this product in Q1 or Q2?")
2. **View the Reasoning Tree** – The AI breaks down its reasoning into numbered steps displayed as an interactive tree
3. **Click a Node to Edit & Fork** – Modify any assumption and save to create a new branch with altered reasoning
4. **Compare Branches** – Select two branches to see how different assumptions led to different conclusions
5. **Export the Final Report** – Once concluded, open the final report page to read, copy, and print your synthesized answer

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
│   │   │   ├── BranchCompare.jsx
│   │   │   └── ConclusionView.jsx
│   │   ├── App.jsx          # Main application
│   │   └── index.css        # Glassmorphism styles
│   ├── index.html
│   └── package.json
├── docs/                    # README images (thumbnail.png, screenshot-1.png)
├── .env.example             # Environment variables template
├── README.md
└── LICENSE
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate initial reasoning from a prompt |
| POST | `/api/fork` | Create a new branch by editing/adding a step |
| POST | `/api/compare` | Compare two reasoning branches |
| POST | `/api/suggestions` | Generate alternative next reasoning steps |
| POST | `/api/finish` | Synthesize reasoning steps into a final conclusion |
| GET | `/api/health` | Health check endpoint |

## Deployment

### Backend (Render)

1. Deploy the `backend` folder to Render
2. Set the `GROQ_API_KEY` environment variable in the Render dashboard
3. Configure CORS for your frontend domain

### Frontend (Vercel / Render)

1. Build with `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` to your deployed backend URL

## Team

- Subhash Boopathi
- SANJAI
- Rohith
- Sandhyarani Yarava

## Hackathon

This project was built for **OpenAI Build Week** (Codex + GPT-5.6), extending an original prototype from the **OpenAI Open Model Hackathon** (gpt-oss). It demonstrates how exposed chain-of-thought can be transformed from a static monologue into an interactive, editable exploration tool—something only possible with open reasoning models.

## License

MIT License – feel free to use this for your hackathon or personal projects!

---

<p align="center"><em>Made with reasoning, forks, and a lot of coffee.</em></p>
