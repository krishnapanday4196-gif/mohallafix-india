import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "MohallaFix India AI Engine"
    VERSION: str = "1.0.0"
    MODEL_NAME: str = "MohallaFix-CivicVision-Hybrid"
    MODEL_VERSION: str = "v1.4.0-civic"
    DUPLICATE_THRESHOLD: float = 0.65
    CRITICAL_SAFETY_KEYWORDS: list = [
        "open manhole", "live wire", "sparking", "current", "electric shock",
        "contamination", "sewage overflow in house", "gas leak", "bridge crack",
        "caved road", "drowning hazard", "flood", "school gate blocked"
    ]

settings = Settings()

