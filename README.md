# ⚡ Digital FTE — Autonomous AI Agent

A fully autonomous AI agent (Digital Full-Time Employee) that reasons, plans, and executes tasks end-to-end using a ReAct loop architecture.

Built with **Next.js 14** (frontend) + **FastAPI** (backend) + **Google Gemini** (AI).

![Digital FTE](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-blue?style=flat-square&logo=google)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-yellow?style=flat-square&logo=python)

---

## 🧠 What It Does

Digital FTE takes a task from the user, breaks it down, selects the right tools, executes them step by step, and delivers a polished final answer — all autonomously.

**ReAct Loop:** THINK → ACT → OBSERVE → DELIVER

---

## 🛠️ Tools Available

| Tool | Description |
|------|-------------|
| 🌐 Web Research | Research any topic and return structured findings |
| ✍️ Generate Social Post | Write Twitter, LinkedIn, Instagram posts |
| 📧 Draft Email | Write professional emails from bullet points |
| 🔍 Analyze Sentiment | Sentiment score, label, themes from text |
| 🗂️ Extract Data | Pull names, dates, places, numbers from raw text |
| 📋 Summarize Text | Condense long text into bullet points |

---

## 🏗️ Architecture
┌─────────────────────┐         ┌──────────────────────┐
│   Next.js Frontend  │──HTTP──▶│   FastAPI Backend    │
│                     │◀──SSE───│                      │
│  Landing Page       │         │  ReAct Agent Loop    │
│  Agent Dashboard    │         │  Tool Executor       │
│  Neural Graph UI    │         │  Gemini 1.5 Pro      │
└─────────────────────┘         └──────────────────────┘

---

## 📁 Folder Structure
digital-fte/
├── backend/
│   ├── main.py          # FastAPI server + SSE streaming
│   ├── agent.py         # ReAct agent core loop
│   ├── tools.py         # All tool definitions + executors
│   ├── requirements.txt
│   └── .env.example
└── frontend/
├── app/
│   ├── page.tsx         # Landing page
│   ├── layout.tsx
│   ├── globals.css
│   └── agent/
│       └── page.tsx     # Agent dashboard
├── components/
│   ├── AgentOrb.tsx     # Animated status orb
│   ├── NeuralGraph.tsx  # Live thought graph
│   └── BotBackground.tsx


---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Fawad-Haider-Kazmi/digital-fte.git
cd digital-fte
```

### 2. Get your free Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Click **Get API Key** → **Create API Key**
4. Copy it — no credit card required

### 3. Setup Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

cp .env.example .env
# Add your GEMINI_API_KEY to .env
```

### 4. Setup Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# Add your NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 5. Run

**Terminal 1 — Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 💡 Example Tasks

- `Write a professional LinkedIn post about the rise of AI agents in 2025`
- `Draft a cold outreach email to a VC investor for my AI startup`
- `Analyze sentiment: "The launch was incredible but pricing felt rushed"`
- `Extract all names and dates from: "On March 14th, Sam Altman met Elon Musk at OpenAI HQ"`
- `Research quantum computing trends and summarize the top breakthroughs`

---

## 🔧 Environment Variables

**backend/.env**
GEMINI_API_KEY=your_gemini_api_key_here


**frontend/.env.local**
NEXT_PUBLIC_API_URL=http://localhost:8000

---

## 👤 Author

**Fawad Haider Kazmi**
- GitHub: [@Fawad-Haider-Kazmi](https://github.com/Fawad-Haider-Kazmi)
- LinkedIn: [fawad-haider-kazmi](https://linkedin.com/in/fawad-haider-kazmi)

---

## 📄 License

MIT License — free to use and modify.

├── .env.example
└── package.json
