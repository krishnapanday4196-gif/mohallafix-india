from typing import List
from backend.app.schemas.complaint_ai import PriorityAnalysisResponse
from backend.app.core.config import settings

def calculate_priority(
    category: str,
    title: str,
    description: str,
    has_image: bool,
    has_video: bool
) -> PriorityAnalysisResponse:
    text = f"{title} {description}".lower()
    score = 0.40  # Medium baseline
    reasoning: List[str] = []
    safety_impact = "Standard civic disruption"

    # Category baseline
    cat_lower = category.lower()
    if "drainage" in cat_lower or "sewer" in cat_lower or "water" in cat_lower:
        score += 0.20
        reasoning.append(f"Category '{category}' carries high public health and sanitation risk")
    elif "street light" in cat_lower:
        score += 0.10
        reasoning.append("Public lighting issues affect nocturnal safety")
    elif "pothole" in cat_lower or "road" in cat_lower:
        score += 0.15
        reasoning.append("Road hazards pose vehicular and pedestrian accident risks")

    # Critical keyword scan
    critical_matches = [kw for kw in settings.CRITICAL_SAFETY_KEYWORDS if kw in text]
    if critical_matches:
        score += 0.35
        safety_impact = f"CRITICAL: Immediate public safety hazard identified ({', '.join(critical_matches)})"
        reasoning.append(f"Emergency safety indicators triggered: {', '.join(critical_matches)}")

    # Evidence bonus (documented claims are prioritized)
    if has_image:
        score += 0.05
        reasoning.append("Visual photographic evidence verified")
    if has_video:
        score += 0.05
        reasoning.append("Motion video evidence verified")

    score = round(min(1.0, max(0.1, score)), 2)

    if score >= 0.85:
        rec_priority = "CRITICAL"
        sla = 12
    elif score >= 0.65:
        rec_priority = "HIGH"
        sla = 24
    elif score >= 0.40:
        rec_priority = "MEDIUM"
        sla = 48
    else:
        rec_priority = "LOW"
        sla = 72

    return PriorityAnalysisResponse(
        recommended_priority=rec_priority,
        priority_score=score,
        public_safety_impact=safety_impact,
        sla_hours_recommended=sla,
        reasoning=reasoning,
        requires_human_verification=True
    )

