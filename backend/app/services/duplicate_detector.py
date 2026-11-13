import math
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.schemas.complaint_ai import DuplicateMatch, DuplicateCheckResponse
from backend.app.core.config import settings

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes distance between two coordinates in meters using Haversine formula.
    """
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def compute_text_similarity(t1: str, t2: str) -> float:
    """
    Computes Jaccard word n-gram similarity between two complaint texts.
    """
    words1 = set(t1.lower().split())
    words2 = set(t2.lower().split())
    if not words1 or not words2:
        return 0.0
    intersection = len(words1.intersection(words2))
    union = len(words1.union(words2))
    return float(intersection) / float(union) if union > 0 else 0.0

def check_duplicates(
    title: str,
    description: str,
    category: str,
    latitude: Optional[float],
    longitude: Optional[float],
    existing_complaints: List[Dict[str, Any]]
) -> DuplicateCheckResponse:
    matches: List[DuplicateMatch] = []
    combined_query_text = f"{title} {description}".strip()

    for item in existing_complaints:
        item_id = str(item.get("id", ""))
        tracking_id = str(item.get("tracking_id", ""))
        item_title = str(item.get("title", ""))
        item_desc = str(item.get("description", ""))
        item_cat = str(item.get("category", "") or item.get("category_name", ""))
        item_lat = item.get("latitude")
        item_lng = item.get("longitude")
        item_created = item.get("created_at")

        item_text = f"{item_title} {item_desc}".strip()
        reasons = []

        # 1. Category match factor
        cat_match = 1.0 if category.lower() in item_cat.lower() or item_cat.lower() in category.lower() else 0.0
        if cat_match > 0.8:
            reasons.append(f"Identical category: {category}")

        # 2. Text similarity factor (0.0 to 1.0)
        text_sim = compute_text_similarity(combined_query_text, item_text)
        if text_sim > 0.35:
            reasons.append(f"High verbal similarity ({round(text_sim * 100)}%)")

        # 3. Geo proximity factor
        dist_m = None
        geo_score = 0.0
        if (
            latitude is not None and longitude is not None and
            item_lat is not None and item_lng is not None
        ):
            try:
                dist_m = haversine_distance(
                    float(latitude), float(longitude),
                    float(item_lat), float(item_lng)
                )
                if dist_m < 100:  # Within 100 meters
                    geo_score = 1.0
                    reasons.append(f"Immediate vicinity: {round(dist_m)} meters away")
                elif dist_m < 300:  # Within 300 meters
                    geo_score = 0.8
                    reasons.append(f"Nearby vicinity: {round(dist_m)} meters away")
                elif dist_m < 800:  # Within 800 meters
                    geo_score = 0.5
                    reasons.append(f"Same locality: {round(dist_m)} meters away")
                else:
                    geo_score = 0.0
            except Exception:
                dist_m = None

        # 4. Time difference factor
        time_diff_hours = None
        time_score = 0.5
        if item_created:
            try:
                # ISO parsing
                d1 = datetime.fromisoformat(item_created.replace("Z", "+00:00"))
                diff = abs((datetime.now(d1.tzinfo) - d1).total_seconds()) / 3600.0
                time_diff_hours = round(diff, 1)
                if diff < 48:
                    time_score = 1.0
                    reasons.append(f"Reported recently: {time_diff_hours} hours ago")
                elif diff < 168:  # 7 days
                    time_score = 0.7
            except Exception:
                pass

        # Weighted composite score:
        # If coordinates are available: Geo 45%, Text 30%, Category 15%, Time 10%
        # If no coordinates: Text 60%, Category 25%, Time 15%
        if dist_m is not None:
            composite = (geo_score * 0.45) + (text_sim * 0.30) + (cat_match * 0.15) + (time_score * 0.10)
        else:
            composite = (text_sim * 0.60) + (cat_match * 0.25) + (time_score * 0.15)

        composite = round(min(1.0, max(0.0, composite)), 3)

        if composite >= 0.40:
            matches.append(DuplicateMatch(
                complaint_id=item_id,
                tracking_id=tracking_id,
                similarity_score=composite,
                distance_meters=round(dist_m, 1) if dist_m is not None else None,
                time_diff_hours=time_diff_hours,
                match_reasons=reasons
            ))

    # Sort matches by highest score
    matches.sort(key=lambda m: m.similarity_score, reverse=True)
    highest = matches[0].similarity_score if matches else 0.0

    return DuplicateCheckResponse(
        status="SUCCESS",
        is_potential_duplicate=highest >= settings.DUPLICATE_THRESHOLD,
        highest_score=highest,
        matches=matches[:5]
    )

