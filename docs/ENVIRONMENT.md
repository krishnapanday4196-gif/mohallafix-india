# MohallaFix India — Environment Variables Guide

All required and optional environment variables used across the Next.js frontend and Python AI backend.

---

## 1. Frontend & Database Variables (`.env.local`)

| Variable | Required | Description | Example |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Your Supabase project URL | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Supabase anonymous public API key | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Supabase service-role secret key for server routes | `eyJhbGciOi...` |
| `NEXT_PUBLIC_AI_BACKEND_URL` | **Yes** | Base URL of the Python FastAPI service | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_URL` | **Yes** | Production or development frontend URL | `http://localhost:3000` |
| `RESEND_API_KEY` | Optional | API key for transactional emails via Resend | `re_123456789...` |
| `SMS_GATEWAY_API_KEY` | Optional | Authorized SMS provider API key | `sms_secret_...` |
| `SMS_GATEWAY_SENDER_ID` | Optional | Registered 6-character sender ID | `MOHFIX` |
| `GEMINI_API_KEY` | Optional | Gemini API key for multimodal reasoning | `AIzaSy...` |

---

## 2. Default Fallback & Honest State Handling

If any of these environment variables are left empty or at placeholder values:
- The user interface and API gracefully report: **NOT CONFIGURED**
- The application will **never crash** or fabricate transactions.
- Zero fake demo records will be injected into dashboards.

