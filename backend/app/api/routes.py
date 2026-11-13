from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
import json
from backend.app.schemas.complaint_ai import (
    ImageClassificationResponse,
    DuplicateCheckRequest,
    DuplicateCheckResponse,
    PriorityAnalysisRequest,
    PriorityAnalysisResponse,
    DepartmentRecommendationRequest,
    DepartmentRecommendationResponse,
    WritingAssistantRequest,
    WritingAssistantResponse,
    GeoClusterRequest,
    GeoClusterResponse,
)
from backend.app.services.classifier import analyze_civic_image
from backend.app.services.duplicate_detector import check_duplicates
from backend.app.services.priority_scorer import calculate_priority
from backend.app.services.writing_assistant import assist_writing
from backend.app.services.geo_cluster import cluster_complaints

router = APIRouter(prefix="/api/ai", tags=["AI Engine"])

@router.post("/classify-image", response_model=ImageClassificationResponse)
async def classify_image(file: UploadFile = File(...)):
    """
    Accepts an uploaded photographic evidence file and classifies civic problem type.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be a valid image format.")

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10MB limit.")

    return analyze_civic_image(content)

@router.post("/duplicate-check", response_model=DuplicateCheckResponse)
async def detect_duplicates(payload: DuplicateCheckRequest):
    """
    Checks if a complaint is a potential duplicate against existing complaints.
    """
    return check_duplicates(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        existing_complaints=payload.existing_complaints
    )

@router.post("/priority-analysis", response_model=PriorityAnalysisResponse)
async def analyze_priority(payload: PriorityAnalysisRequest):
    """
    Evaluates civic priority and recommends SLA hours.
    """
    return calculate_priority(
        category=payload.category,
        title=payload.title,
        description=payload.description,
        has_image=payload.has_image,
        has_video=payload.has_video
    )

@router.post("/writing-assistant", response_model=WritingAssistantResponse)
async def writing_assistant(payload: WritingAssistantRequest):
    """
    Assists citizens with structuring complaint descriptions into clear civic reports.
    """
    return assist_writing(
        raw_text=payload.raw_text,
        category=payload.category or "",
        location_hint=payload.location_hint or ""
    )

@router.post("/recommend-department", response_model=DepartmentRecommendationResponse)
async def recommend_department(payload: DepartmentRecommendationRequest):
    """
    Maps complaint category and text to the responsible municipal department.
    """
    cat = payload.category.lower()
    text = f"{payload.title} {payload.description}".lower()

    if "road" in cat or "pothole" in cat or "asphalt" in text or "bridge" in text:
        return DepartmentRecommendationResponse(
            recommended_department_name="Public Works Department (Roads & Bridges)",
            department_code="PWD-ROADS",
            confidence=0.92,
            alternative_department="Civic Infrastructure Board"
        )
    elif "garbage" in cat or "sanitation" in cat or "waste" in text or "dump" in text:
        return DepartmentRecommendationResponse(
            recommended_department_name="Municipal Sanitation & Waste Management",
            department_code="SWACHH-CELL",
            confidence=0.94,
            alternative_department="Health & Hygiene Cell"
        )
    elif "water" in cat or "leak" in cat or "pipeline" in text:
        return DepartmentRecommendationResponse(
            recommended_department_name="Jal Board & Public Water Supply",
            department_code="WATER-BOARD",
            confidence=0.95,
            alternative_department="Stormwater Drainage & Sewerage Division"
        )
    elif "light" in cat or "electricity" in cat or "lamp" in text or "wire" in text:
        return DepartmentRecommendationResponse(
            recommended_department_name="Electricity & Street Lighting Board",
            department_code="STREETLIGHT-DEPT",
            confidence=0.93,
            alternative_department="Public Works Department"
        )
    elif "drain" in cat or "sewer" in cat or "manhole" in text:
        return DepartmentRecommendationResponse(
            recommended_department_name="Stormwater Drainage & Sewerage Division",
            department_code="DRAINAGE-DEPT",
            confidence=0.96,
            alternative_department="Municipal Sanitation & Waste Management"
        )
    elif "park" in cat or "tree" in cat or "garden" in text:
        return DepartmentRecommendationResponse(
            recommended_department_name="Urban Parks & Public Horticulture",
            department_code="PARKS-DEPT",
            confidence=0.90,
            alternative_department="Civic Infrastructure Board"
        )
    else:
        return DepartmentRecommendationResponse(
            recommended_department_name="General Grievance Redressal Cell",
            department_code="CIVIC-INFRA",
            confidence=0.75,
            alternative_department="Public Works Department"
        )

@router.post("/geo-cluster", response_model=GeoClusterResponse)
async def geo_cluster(payload: GeoClusterRequest):
    """
    Groups complaint points within a radius to identify problem clusters and hotspots.
    """
    return cluster_complaints(
        complaints=payload.complaints,
        radius_meters=payload.radius_meters
    )

