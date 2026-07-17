# Environment Variables Configuration

This document lists all the environment variables required to run WhatIfGPT locally.

## Setup Instructions

1. Copy this file's content or use the `.env.example` file as a template
2. Create a new file named `.env` in the **root directory** of the project
3. Fill in your actual API keys and configuration values
4. For frontend variables, you may also need to create a `.env` file in the `frontend/` directory with `VITE_` prefixed variables

---

## Required Environment Variables

### Backend Variables (Root `.env`)

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI model inference | `gsk_abcdefghijklmnopqrstuvwxyz1234567890` | ✅ Yes |
| `PORT` | Port number for the backend server | `5000` | ❌ No (default: 5000) |
| `DEBUG` | Enable debug mode for development | `True` or `False` | ❌ No (default: False) |

### Frontend Variables (frontend/.env)

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_API_URL` | Backend API URL for production builds | `http://localhost:5000` | ❌ No (defaults to localhost:5000 in dev) |
| `VITE_APP_TITLE` | Custom application title | `WhatIfGPT` | ❌ No (default: WhatIfGPT) |

---

## Quick Start Example

### Root `.env` file:
```env
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
PORT=5000
DEBUG=True
```

### Frontend `.env` file (inside `frontend/` folder):
```env
VITE_API_URL=http://localhost:5000
VITE_APP_TITLE=WhatIfGPT
```

---

## How to Get a Groq API Key

1. Visit [https://console.groq.com](https://console.groq.com)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

**⚠️ Important Security Notes:**
- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Keep your API keys secret and do not share them
- Rotate your API keys periodically

---

## Troubleshooting

### "Missing script: dev" Error
Make sure you're running commands from the correct directory:
```bash
# For frontend development
cd frontend
npm run dev

# For backend development
cd ..
python backend/app.py
```

### Environment Variables Not Loading
- Ensure the `.env` file is in the correct directory
- Restart your development server after changing `.env`
- For Vite (frontend), variables must be prefixed with `VITE_`
- For Flask (backend), ensure python-dotenv is installed

### Connection Errors
- Verify the backend is running on the port specified in `VITE_API_URL`
- Check for CORS issues in browser console
- Ensure both frontend and backend are running simultaneously
