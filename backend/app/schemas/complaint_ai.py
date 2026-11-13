from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class ImageClassificationRequest(BaseModel):
    image_url: Optional[str] = None
    image_base64: Optional[str] = None

class ImageClassificationResponse(BaseModel):
    status: str
    model_name: str
    model_version: str
    predicted_category: str
    confidence: float
    detected_features: List[str]
    is_valid_civic_issue: bool
    manual_review_recommended: bool

class DuplicateCheckRequest(BaseModel):
    title: str
    description: str
    category: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    existing_complaints: List[Dict[str, Any]] = Field(default_factory=list)

class DuplicateMatch(BaseModel):
    complaint_id: str
    tracking_id: str
    similarity_score: float
    distance_meters: Optional[float]
    time_diff_hours: Optional[float]
    match_reasons: List[str]

class DuplicateCheckResponse(BaseModel):
    status: str
    is_potential_duplicate: bool
    highest_score: float
    matches: List[DuplicateMatch]

class PriorityAnalysisRequest(BaseModel):
    category: str
    title: str
    description: str
    has_image: bool = False
    has_video: bool = False
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class PriorityAnalysisResponse(BaseModel):
    recommended_priority: str  # LOW, MEDIUM, HIGH, CRITICAL
    priority_score: float  # 0.0 to 1.0
    public_safety_impact: str
    sla_hours_recommended: int
    reasoning: List[str]
    requires_human_verification: bool

class DepartmentRecommendationRequest(BaseModel):
    category: str
    title: str
    description: str

class DepartmentRecommendationResponse(BaseModel):
    recommended_department_name: str
    department_code: str
    confidence: float
    alternative_department: Optional[str] = None

class WritingAssistantRequest(BaseModel):
    raw_text: str
    category: Optional[str] = None
    location_hint: Optional[str] = None

class WritingAssistantResponse(BaseModel):
    refined_title: str
    refined_description: str
    extracted_hazards: List[str]
    suggested_tags: List[str]

class GeoClusterRequest(BaseModel):
    radius_meters: float = 1000.0
    complaints: List[Dict[str, Any]] = Field(default_factory=list)

class GeoClusterGroup(BaseModel):
    cluster_id: str
    center_lat: float
    center_lng: float
    count: int
    complaint_ids: List[str]
    primary_category: str
    severity_level: str

class GeoClusterResponse(BaseModel):
    total_complaints_analyzed: int
    clusters_found: int
    clusters: List[GeoClusterGroup]

