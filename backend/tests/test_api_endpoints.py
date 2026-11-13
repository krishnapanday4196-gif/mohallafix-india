from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"

def test_priority_analysis_endpoint():
    payload = {
        "category": "Street Light Problems",
        "title": "Dark street near hospital",
        "description": "Streetlight broken for 3 weeks",
        "has_image": True,
        "has_video": False
    }
    res = client.post("/api/ai/priority-analysis", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "recommended_priority" in data
    assert "priority_score" in data

def test_writing_assistant_endpoint():
    payload = {
        "raw_text": "Sadak par pani bhara hai manhole khula hua hai",
        "category": "Drainage and Sewer",
        "location_hint": "Sector 62 Noida"
    }
    res = client.post("/api/ai/writing-assistant", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "refined_title" in data
    assert "extracted_hazards" in data

def test_recommend_department_endpoint():
    payload = {
        "category": "Road Damage and Potholes",
        "title": "Broken road asphalt",
        "description": "Crater in the road"
    }
    res = client.post("/api/ai/recommend-department", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["department_code"] == "PWD-ROADS"

