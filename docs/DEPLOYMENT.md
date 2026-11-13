# MohallaFix India — Production Deployment Guide

This guide details how to deploy MohallaFix India to production infrastructure across Vercel/Cloudflare, Python hosting, and Supabase.

---

## 1. Supabase Database Deployment

1. **Create Supabase Project:**
   - Sign in to [Supabase Console](https://supabase.com).
   - Create a new project (e.g. `mohallafix-india-prod`) in your preferred Indian region (`ap-south-1` Mumbai recommended for lowest latency).
2. **Execute Database Migrations:**
   - Open the **SQL Editor** in the Supabase Dashboard.
   - Open [00001_initial_schema.sql](file:///c:/Users/krish/OneDrive/Desktop/mohallafixindi/supabase/migrations/00001_initial_schema.sql).
   - Paste and run the entire script.
   - Verify all 17 tables and RLS policies are created in the **Table Editor**.
3. **Configure Storage Buckets:**
   - In **Storage**, create two public/authenticated buckets:
     - `complaint-media` (Max file size: 25MB, Allowed MIME types: images and video/mp4)
     - `resolution-evidence` (Max file size: 15MB)
4. **Copy API Keys:**
   - Go to **Project Settings -> API**.
   - Copy `Project URL`, `anon public key`, and `service_role secret key`.

---

## 2. Python FastAPI AI Microservice Deployment

The FastAPI microservice can be deployed to any container or Python host (Railway, Render, Fly.io, Google Cloud Run, or AWS App Runner).

### Deploying with Docker
A production `Dockerfile` for the backend:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ backend/

EXPOSE 8000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Health Check Endpoint
- Health check URL: `https://your-ai-service.com/health`
- Expected response: `{"status": "HEALTHY", "service": "MohallaFix India AI Engine"}`

---

## 3. Next.js Frontend Deployment (Vercel)

1. **Connect Git Repository:**
   - Push this repository to GitHub or GitLab.
   - In Vercel, click **Add New Project** and select the repository.
2. **Configure Environment Variables:**
   Add the following variables in Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://<your-project>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<your-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-service-role-key>`
   - `NEXT_PUBLIC_AI_BACKEND_URL`: `https://<your-deployed-ai-microservice>`
   - `NEXT_PUBLIC_APP_URL`: `https://mohallafix.in`
3. **Deploy:**
   - Click **Deploy**. Vercel will execute `npm run build` and provision edge CDN caches.

---

## 4. Production Domain & SSL

- Configure DNS CNAME and A records pointing to Vercel/Cloudflare.
- Enforce HTTPS and strict HSTS headers.
- Set up domain email records (SPF, DKIM, DMARC) for Resend transactional emails.

