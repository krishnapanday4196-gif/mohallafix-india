import pytest
import io
from PIL import Image
from backend.app.services.classifier import analyze_civic_image
from backend.app.services.duplicate_detector import check_duplicates, haversine_distance
from backend.app.services.priority_scorer import calculate_priority
from backend.app.services.writing_assistant import assist_writing
from backend.app.services.geo_cluster import cluster_complaints

def test_haversine_distance():
    # Distance between Connaught Place (28.6315, 77.2167) and India Gate (28.6129, 77.2295) is approx 2.4 km
    d = haversine_distance(28.6315, 77.2167, 28.6129, 77.2295)
    assert 2000 < d < 3000

def test_image_classifier_synthetic_bytes():
    # Create a small valid test image in memory
    img = Image.new("RGB", (100, 100), color=(40, 40, 40))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    res = analyze_civic_image(buf.getvalue())
    assert res.status == "SUCCESS"
    assert res.model_name is not None
    assert 0.0 <= res.confidence <= 1.0

def test_priority_scorer_critical():
    res = calculate_priority(
        category="Drainage and Sewer",
        title="Open manhole on main road",
        description="Dangerous open manhole near primary school, children walking nearby",
        has_image=True,
        has_video=False
    )
    assert res.recommended_priority in ["HIGH", "CRITICAL"]
    assert res.priority_score >= 0.70
    assert "manhole" in res.public_safety_impact.lower()

def test_duplicate_detector():
    existing = [{
        "id": "complaint-101",
        "tracking_id": "MHF-20261113-ABCD",
        "title": "Huge pothole opposite metro pillar 45",
        "description": "Deep gaddha damaging bike tires on main road",
        "category": "Road Damage and Potholes",
        "latitude": 28.6315,
        "longitude": 77.2167,
        "created_at": "2026-11-13T10:00:00Z"
    }]

    # Query with nearby coordinates and similar verbal description
    res = check_duplicates(
        title="Pothole near metro pillar 45",
        description="Deep pothole in asphalt road",
        category="Road Damage and Potholes",
        latitude=28.6316,
        longitude=77.2168,
        existing_complaints=existing
    )
    assert len(res.matches) > 0
    assert res.matches[0].distance_meters < 50
    assert res.is_potential_duplicate is True

def test_writing_assistant():
    res = assist_writing(
        raw_text="bahut bada gaddha hai sadak par paani bhara hua hai",
        category="Road Damage and Potholes",
        location_hint="Near Sector 14 market"
    )
    assert "Sector 14 market" in res.refined_title
    assert "Road Damage and Potholes" in res.refined_description
    assert "GRIEVANCE SUMMARY" in res.refined_description
