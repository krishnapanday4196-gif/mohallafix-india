from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.api.routes import router as ai_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Real-world civic problem AI analysis microservice for MohallaFix India.",
)

# CORS configuration to allow local Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "status": "OPERATIONAL",
        "version": settings.VERSION,
        "model_version": settings.MODEL_VERSION,
        "endpoints": [
            "/api/ai/classify-image",
            "/api/ai/duplicate-check",
            "/api/ai/priority-analysis",
            "/api/ai/writing-assistant",
            "/api/ai/recommend-department",
            "/api/ai/geo-cluster"
        ]
    }

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": settings.APP_NAME,
        "version": settings.VERSION,
        "engine": "FastAPI + Computer Vision + Heuristics"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

