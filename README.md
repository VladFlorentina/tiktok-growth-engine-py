# ⚡ TikTok Growth Engine

AI-powered marketing SaaS for TikTok & Instagram. Generate viral scripts, hooks, trend insights, and competitor analysis using **Google Gemini AI** + **FastAPI** + **Next.js**.

---

## 🏗️ Project Structure

```
tiktok-growth-engine-py/
├── backend/                  # FastAPI (Python 3.12)
│   ├── main.py               # App entry point
│   ├── config.py             # Settings (reads .env)
│   ├── database.py           # Supabase client
│   ├── requirements.txt
│   ├── .env.example          # ← Copy to .env and fill in keys
│   ├── models/schemas.py     # Pydantic request/response models
│   ├── routers/              # API routes
│   │   ├── auth.py           # /api/auth/*
│   │   ├── hooks.py          # /api/hooks/generate
│   │   ├── scripts.py        # /api/scripts/generate
│   │   ├── trends.py         # /api/trends/
│   │   ├── competitor.py     # /api/competitor/analyze
│   │   └── ugc.py            # /api/ugc/creators
│   ├── services/
│   │   └── ai_service.py     # Google Gemini AI logic
│   └── supabase/migrations/
│       └── 001_initial_schema.sql  # Run in Supabase SQL Editor
│
└── frontend/                 # Next.js 15 (TypeScript)
    └── src/
        ├── app/
        │   ├── page.tsx            # Landing page
        │   └── dashboard/          # All tool pages
        │       ├── hooks/          # Hook Generator
        │       ├── scripts/        # Script Engine
        │       ├── trends/         # Trend Radar
        │       ├── competitor/     # Competitor Analysis
        │       └── ugc/            # UGC Bridge
        ├── lib/api.ts              # Backend API client
        └── styles/globals.css      # Design system (dark mode)
```

---

## 🚀 Quick Start

### 1. Backend Setup

```powershell
cd backend

# Copy environment template
Copy-Item .env.example .env

# Edit .env — add your keys:
# GEMINI_API_KEY = from https://aistudio.google.com/app/apikey
# SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY = from Supabase Dashboard

# Create virtual environment & install deps
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Start the API
uvicorn main:app --reload --port 8000
```

✅ API docs at: **http://localhost:8000/docs**

> **Demo Mode**: Works without a Gemini key! Set `DEMO_MODE=true` in `.env` for rich mock data.

---

### 2. Database Setup (Supabase)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Open **SQL Editor** → **New Query**
3. Paste the contents of `backend/supabase/migrations/001_initial_schema.sql`
4. Click **Run**

---

### 3. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

✅ App at: **http://localhost:3000**

---

## 🔑 Required Environment Variables

| Variable | Where to get it |
|---|---|
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com/app/apikey) — Free |
| `SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12 + FastAPI |
| AI | Google Gemini 1.5 Flash |
| Database & Auth | Supabase (PostgreSQL) |
| Frontend | Next.js 15 (TypeScript) |
| Hosting | Vercel (frontend) + Railway/Render (backend) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/hooks/generate` | Generate viral hook variants |
| POST | `/api/scripts/generate` | Generate full video script |
| GET | `/api/trends/` | Get trending sounds & hashtags |
| POST | `/api/competitor/analyze` | Analyze competitor video |
| GET | `/api/ugc/creators` | Browse creator directory |
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
