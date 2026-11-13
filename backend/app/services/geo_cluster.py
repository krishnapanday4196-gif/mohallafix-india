from typing import List, Dict, Any
from backend.app.schemas.complaint_ai import GeoClusterGroup, GeoClusterResponse
from backend.app.services.duplicate_detector import haversine_distance

def cluster_complaints(complaints: List[Dict[str, Any]], radius_meters: float = 1000.0) -> GeoClusterResponse:
    """
    Groups complaints within radius_meters into civic problem clusters / hotspots.
    """
    valid = []
    for c in complaints:
        lat = c.get("latitude")
        lng = c.get("longitude")
        cid = str(c.get("id", ""))
        cat = str(c.get("category", "") or c.get("category_name", "General"))
        if lat is not None and lng is not None:
            try:
                valid.append({
                    "id": cid,
                    "lat": float(lat),
                    "lng": float(lng),
                    "category": cat
                })
            except (ValueError, TypeError):
                continue

    clusters: List[GeoClusterGroup] = []
    visited = set()

    for i, point in enumerate(valid):
        if point["id"] in visited:
            continue

        cluster_points = [point]
        visited.add(point["id"])

        for j, other in enumerate(valid):
            if other["id"] in visited:
                continue

            dist = haversine_distance(point["lat"], point["lng"], other["lat"], other["lng"])
            if dist <= radius_meters:
                cluster_points.append(other)
                visited.add(other["id"])

        if len(cluster_points) >= 1:
            avg_lat = sum(p["lat"] for p in cluster_points) / len(cluster_points)
            avg_lng = sum(p["lng"] for p in cluster_points) / len(cluster_points)
            count = len(cluster_points)

            severity = "LOW"
            if count >= 5:
                severity = "CRITICAL_HOTSPOT"
            elif count >= 3:
                severity = "HIGH_CLUSTER"
            elif count >= 2:
                severity = "MEDIUM"

            clusters.append(GeoClusterGroup(
                cluster_id=f"cluster-{len(clusters)+1}",
                center_lat=round(avg_lat, 6),
                center_lng=round(avg_lng, 6),
                count=count,
                complaint_ids=[p["id"] for p in cluster_points],
                primary_category=point["category"],
                severity_level=severity
            ))

    clusters.sort(key=lambda c: c.count, reverse=True)

    return GeoClusterResponse(
        total_complaints_analyzed=len(valid),
        clusters_found=len(clusters),
        clusters=clusters
    )

