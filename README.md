# MohallaFix India
**Tagline:** Report. Track. Resolve.  
**Mission:** A production-ready digital civic platform enabling Indian citizens to report public infrastructure issues, track complaints transparently with verifiable evidence, and connect with authorized municipal departments and ground officers.

---

## 🏛️ Absolute Development Policy

- **ZERO Demo / Fake Data:** No simulated counts, no invented complaints, no mock officers.
- **Honest Empty States:** When real records are absent from the database, the system displays: *"No complaints found yet."*
- **Unambiguous Service Status:** If third-party services (Supabase credentials, email gateway, SMS gateway) are unconfigured, the platform explicitly marks them as **NOT CONFIGURED**.
- **Verified Lifecycle Audit:** Status transitions must be accompanied by reasons and timestamps, permanently saved to `complaint_status_history`. A complaint is never marked permanently resolved without citizen confirmation or administrative verification.
- **Government Integration Disclosure:** MohallaFix maintains full transparency: complaints are managed internally until formal government API credentials and partnership agreements are activated.

---

## 🎨 Premium White SaaS Interface

- **Canvas:** Clean white (`#ffffff`) and soft slate neutrals (`#f8fafc`, `#f1f5f9`).
- **Typography:** Charcoal headers (`#0f172a`) and body slate (`#334155`).
- **Civic Green Accent:** Indian tricolor inspired emerald (`#059669`, `#10b981`).
- **Cards & Shadows:** `rounded-2xl` containers with refined subtle shadows `shadow-[0_2px_12px_rgba(0,0,0,0.03)]`.
- **Icons:** Professional Lucide React icons.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion |
| **Forms & Validation** | React Hook Form, Zod |
| **Interactive Maps** | OpenStreetMap, Leaflet (dynamic client SSR-safe) |
| **Database & Auth** | Supabase PostgreSQL (17 tables), Supabase Auth, Row Level Security (RLS) |
| **AI Microservice** | Python 3.15, FastAPI, Pillow, NumPy, Scikit-learn heuristics, Pytest |
| **Testing** | Node.js Built-in Test Runner, Pytest |

---

## 📁 Project Architecture

```
mohallafixindi/
├── app/
│   ├── (public)/          # Home, About, How It Works, Categories, Public Complaints, Map, Track, Contact, Privacy, Terms
│   ├── (auth)/            # Login, Register, Forgot Password, Verify Email
│   ├── citizen/           # Citizen Dashboard, Submit, My Complaints, Detail with Confirmation/Reopen, Profile, Notifications, Feedback
│   ├── officer/           # Officer Overview, Assigned Roster, Investigation, Progress Notes, Resolution Proof Upload, Reports
│   ├── admin/             # Admin Dashboard, Complaints, Officers, Departments, Categories, Escalations, Analytics, Reports, Logs, Settings
│   ├── ai/                # AI Intelligence Hub, Image Classifier, Duplicate Detector, Priority Scorer, History
│   └── api/               # Next.js Route Handlers (complaints, categories, departments, analytics, ai-proxy)
├── backend/
│   ├── app/
│   │   ├── api/routes.py  # FastAPI AI Endpoints
│   │   ├── services/      # Classifier, Duplicate Detector, Priority Scorer, Writing Assistant, Geo Cluster
│   │   ├── schemas/       # Pydantic schemas
│   │   └── core/config.py # Settings & keyword dictionaries
│   ├── main.py            # FastAPI Entrypoint
│   └── tests/             # Pytest test suite (9 tests passing)
├── components/
│   ├── ui/                # Badge, Button, Input, Card, EmptyState
│   ├── layout/            # Navbar, Footer, Sidebar, PortalHeader
│   ├── complaints/        # ComplaintCard, Timeline, StatusBadge
│   └── maps/              # ComplaintMap (Leaflet OpenStreetMap)
├── lib/
│   ├── supabase/          # Browser, server, and service-role admin clients
│   └── services/          # Real database queries, analytics calculator, categories & depts
├── supabase/
│   └── migrations/        # 00001_initial_schema.sql (17 PostgreSQL tables, RLS policies, seeds)
├── docs/                  # API, Deployment, and Environment setup documentation
└── tests/                 # Unit test suite
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v20+ or v24+
- Python 3.10+
- A Supabase Project (free or self-hosted)

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Python AI Backend Setup
```bash
# Activate virtual environment
backend\venv\Scripts\activate   # Windows
# source backend/venv/bin/activate # macOS/Linux

# Install backend dependencies
pip install fastapi uvicorn pydantic python-multipart pillow httpx numpy pytest

# Start AI microservice on port 8000
python -m uvicorn backend.main:app --port 8000 --reload
```
API Documentation available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Database Setup
Execute `supabase/migrations/00001_initial_schema.sql` in your Supabase SQL Editor.  
This automatically generates:
- 17 PostgreSQL tables
- Row Level Security (RLS) policies
- Department and category seeds
- Updated_at triggers and performance indexes

---

## 🧪 Automated Testing

### Frontend Test Suite
```bash
npm test
```
*Validates tracking ID generation format (`MHF-YYYYMMDD-XXXX`), 6-digit Indian PIN code constraints, lifecycle status transitions, and data privacy isolation.*

### Backend AI Test Suite
```bash
backend\venv\Scripts\python -m pytest backend/tests
```
*Validates computer vision feature extraction, Haversine geospatial distance calculation, verbal Jaccard duplicate detection, emergency priority scoring, and NLP writing assistant.*

---

## 🔒 Security & Privacy Features

- **Row Level Security (RLS):** Citizen records are protected at the database tier; only owners and assigned officers can read private context.
- **Data Privacy Isolation:** Citizen phone numbers, email addresses, and passwords are never exposed in public feeds or maps.
- **Anti-Tampering Audit:** All status updates record user ID, timestamp, prior state, new state, and mandatory reason in `complaint_status_history`.
- **Server-Side Validation:** All API endpoints validate input with Zod and Pydantic.

---

## 📄 License
MIT License. Built for Indian Civic Transparency.
