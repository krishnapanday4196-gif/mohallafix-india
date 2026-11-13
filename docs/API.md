# MohallaFix India — API Documentation

This document describes all REST API endpoints available in the Next.js App Router and the Python FastAPI AI microservice.

---

## 1. Next.js Route Handlers

### `GET /api/complaints`
Retrieves stored civic complaints from PostgreSQL.
- **Query Parameters:**
  - `category_id` (optional): Filter by category UUID.
  - `status` (optional): Filter by lifecycle status (`SUBMITTED`, `IN_PROGRESS`, `RESOLVED`, etc.).
  - `search` (optional): Text search query against title, description, or tracking ID.
  - `limit` (optional): Maximum records to return (default: 50).
- **Response:**
  ```json
  {
    "data": [
      {
        "id": "uuid",
        "tracking_id": "MHF-20261113-A8F2",
        "title": "Broken road asphalt",
        "description": "...",
        "status": "IN_PROGRESS",
        "priority": "HIGH",
        "address": "...",
        "latitude": 28.6139,
        "longitude": 77.2090,
        "category": { ... },
        "department": { ... }
      }
    ],
    "is_configured": true
  }
  ```

---

### `POST /api/complaints`
Registers a new citizen complaint.
- **Request Body (JSON):**
  ```json
  {
    "title": "Deep pothole in front of community center",
    "description": "Pothole has accumulated stagnant rainwater and damaged vehicles.",
    "category_id": "uuid",
    "address": "Sector 14 Market Road",
    "pincode": "110001",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "priority": "HIGH",
    "is_public": true,
    "media_urls": ["https://..."]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "tracking_id": "MHF-20261113-9B21",
    "complaint": { ... }
  }
  ```

---

### `GET /api/complaints/:id`
Retrieves single complaint by UUID or tracking ID with complete joins (media, status history timeline, comments, department).

---

### `PATCH /api/complaints/:id`
Executes an authorized status transition in the complaint lifecycle.
- **Request Body (JSON):**
  ```json
  {
    "status": "RESOLVED",
    "reason": "Road filled with dense bituminous concrete.",
    "evidence_media_url": "https://..."
  }
  ```
- **Lifecycle Transitions Enforced:**
  - `SUBMITTED` -> `UNDER_REVIEW` -> `VERIFIED` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED` -> `CITIZEN_CONFIRMED`
  - Reopened state: `RESOLVED` -> `REOPENED` (Citizen privilege)
  - Escalated state: `ASSIGNED` / `IN_PROGRESS` -> `ESCALATED` (SLA breach / Admin intervention)

---

### `GET /api/categories`
Returns active infrastructure problem categories with SLA turnaround hours.

---

### `GET /api/departments`
Returns configured municipal departments (PWD, Sanitation, Water Board, etc.).

---

### `GET /api/analytics`
Returns live metrics computed directly from PostgreSQL queries:
- Total, pending, in-progress, resolved, confirmed, reopened, escalated.
- Category-wise distribution.
- Department-wise workload.

---

## 2. Python FastAPI AI Microservice (`:8000`)

### `GET /health`
Returns microservice operational status.

### `POST /api/ai/classify-image`
Computer Vision model that evaluates uploaded photographic evidence bytes.
- **Payload:** `multipart/form-data` with `file`.
- **Response:**
  ```json
  {
    "status": "SUCCESS",
    "model_name": "MohallaFix-CivicVision-Hybrid",
    "model_version": "v1.4.0-civic",
    "predicted_category": "Road Damage and Potholes",
    "confidence": 0.86,
    "detected_features": [
      "High asphalt surface irregularity detected",
      "Pavement depression patterns"
    ],
    "is_valid_civic_issue": true,
    "manual_review_recommended": false
  }
  ```

---

### `POST /api/ai/duplicate-check`
Calculates composite duplicate similarity score:
`Score = (GeoScore * 0.45) + (VerbalScore * 0.30) + (CategoryScore * 0.15) + (TimeScore * 0.10)`.
- Never automatically deletes complaints; flags potential duplicates above threshold (0.65).

---

### `POST /api/ai/priority-analysis`
Scans for critical public safety indicators (open manholes, live wires, chemical leaks) and calculates SLA hours.

---

### `POST /api/ai/writing-assistant`
NLP engine that restructures raw citizen grievances into structured civic incident reports.

---

### `POST /api/ai/geo-cluster`
Runs spatial clustering within a specified radius (e.g., 1000m) to identify neighborhood problem hotspots.

