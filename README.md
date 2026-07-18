<h1 align="center">WhatIfGPT</h1>

<p align="center">
  <strong>Don't just read reasoning — fork it, edit it, and watch the answer change.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/License-MIT-purple" alt="License" />
</p>

<p align="center">
  <img src="./docs/thumbnail.png" alt="WhatIfGPT banner" width="100%" />
</p>

---

WhatIfGPT is an interactive AI reasoning explorer that turns raw `gpt-oss`/LLM chain-of-thought outputs into an editable, forkable tree structure. Unlike traditional chatbots that present reasoning as a static, read-only wall of text, WhatIfGPT allows you to visually inspect the AI's step-by-step logic, click on any intermediate step to edit or rephrase assumptions, and instantly fork the path to explore how different hypotheses or tweaks change the final synthesized conclusion.

## Features

- 🔀 **Interactive Reasoning Tree**: Visualize the AI's step-by-step logic in an interactive, clean nodes-based graph view.
- ✏️ **Fork & Edit**: Modify any reasoning node's content, fork it, and let the AI compute new paths from that point.
- 💡 **AI Next-Step Suggestions**: View and select from alternative next steps proposed by the AI to spawn new branches.
- ⚖️ **Branch Comparison**: Compare different reasoning branches side-by-side to easily spot key differences.
- 📄 **Dedicated Final Report View**: Review a distraction-free, full-page digital report view of your finalized conclusion.
- ✍️ **Premium Markdown Formatting**: The final synthesized report is rendered with elegant headers, bold text, lists, and quotes.
- 📋 **One-Click Copy**: Instantly copy the entire finalized conclusion to your clipboard with clean markdown preservation.
- 🎨 **Glassmorphism UI**: Beautiful, premium dark-mode interface complete with animated gradient backdrops.

## Demo

![Home screen](./docs/screenshot-1.png)
*Home screen showing prompt input to initiate a new reasoning tree.*

![Reasoning tree in action](./docs/screenshot-2.png)
*Interactive reasoning tree view where users can click to edit/fork nodes and generate alternative branches.*

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, React Flow |
| **Backend** | FastAPI (Python) |
| **LLM** | `gpt-oss` via Groq API / GPT-5.6 via Codex |
| **Styling** | Custom Glassmorphism CSS with backdrop blur effects |

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.9+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/subhashdoc234xyz/WhatIfGPT.git
cd WhatIfGPT
```

### 2. Environment variable setup

Copy `.env.example` in the root directory to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your Groq API key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Install dependencies

```bash
# Install root package runner dependencies
npm install

# Install Frontend dependencies
cd frontend && npm install

# Install Backend dependencies
cd ../backend
pip install -r requirements.txt
```

### 4. Run the application

To run both services simultaneously from the root directory:

```bash
# Terminal 1 - Start the FastAPI backend
cd backend
python main.py

# Terminal 2 - Start the React frontend
cd frontend
npm run dev
```

The frontend application will be running locally at `http://localhost:5173`.

## Usage

1. **Enter a Question**: Input a prompt or problem you want to analyze in detail.
2. **View Reasoning Tree**: Navigate the generated step-by-step reasoning tree.
3. **Fork & Edit**: Click any node in the tree, edit its text or assumptions, and click "Fork" to spin off a new branch.
4. **Compare Branches**: Use the branch selection control to view and compare different reasoning paths side-by-side.
5. **Export Final Report**: Finalize a branch to synthesize it into a clean, copyable markdown report.

## Project Structure

```
WhatIfGPT/
├── backend/            # FastAPI backend server & LLM integration
├── docs/               # Documentation images
├── frontend/           # Vite + React frontend dashboard
├── .env.example        # Environment variable template
├── README.md           # This file
└── LICENSE             # License terms
```

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/generate` | Generates initial reasoning steps from a user prompt |
| `POST` | `/api/fork` | Fork a reasoning path from a specific node with modified text |
| `POST` | `/api/compare` | Compares two reasoning paths/branches side-by-side |
| `POST` | `/api/suggestions` | Generates alternative step suggestions for a given node |
| `POST` | `/api/finish` | Synthesizes a path of reasoning steps into a final conclusion document |
| `GET` | `/api/health` | Backend status check endpoint |

## Deployment

### Backend (Render)
1. Set up a Web Service on Render pointing to the `/backend` folder.
2. Select **Python** as the environment and use `uvicorn main:app --host 0.0.0.0 --port $PORT` as the start command.
3. Add the `GROQ_API_KEY` to the environment variables section in your Render dashboard.

### Frontend (Vercel / Render)
1. Build the production build using `npm run build` within the frontend directory.
2. Deploy the resulting `/frontend/dist` directory to Vercel or Render.
3. Make sure to point `VITE_API_URL` to your live backend endpoint.

## Team

- Subhash Boopathi
- SANJAI
- Rohith
- Sandhyarani Yarava

## Hackathon

This project was built for **OpenAI Build Week (Codex + GPT-5.6)**. It leverages the raw chain-of-thought generation features of open LLMs, rendering reasoning steps as modular interactive blocks that let users override model assumptions at any point.

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <em>Made with reasoning, forks, and a lot of coffee.</em>
</p>
