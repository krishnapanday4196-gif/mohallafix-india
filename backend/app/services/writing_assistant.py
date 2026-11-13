import re
from typing import List
from backend.app.schemas.complaint_ai import WritingAssistantResponse

def assist_writing(raw_text: str, category: str = "", location_hint: str = "") -> WritingAssistantResponse:
    """
    Refines raw, conversational citizen complaints into structured, professional civic reports.
    """
    clean_text = raw_text.strip()

    # Extract potential keywords
    hazards = []
    lower = clean_text.lower()
    if "pothole" in lower or "gaddha" in lower or "broken road" in lower:
        hazards.append("Road Defect / Pothole")
    if "water" in lower or "paani" in lower or "leak" in lower:
        hazards.append("Water Leakage / Pipe Damage")
    if "garbage" in lower or "kachra" in lower or "waste" in lower:
        hazards.append("Solid Waste Accumulation")
    if "light" in lower or "dark" in lower or "andhera" in lower:
        hazards.append("Street Light Failure")
    if "manhole" in lower or "drain" in lower or "naali" in lower:
        hazards.append("Drainage / Open Manhole Danger")

    # Generate polished title
    first_sentence = clean_text.split(".")[0].split("\n")[0]
    if len(first_sentence) > 60:
        first_sentence = first_sentence[:57] + "..."

    issue_type = hazards[0] if hazards else (category or "Public Infrastructure Concern")
    loc_part = f" near {location_hint}" if location_hint else ""
    refined_title = f"{issue_type}{loc_part}: {first_sentence}"

    # Generate structured description
    refined_description = (
        f"GRIEVANCE SUMMARY:\n{clean_text}\n\n"
        f"REPORTED CONTEXT:\n"
        f"- Target Category: {category or 'General Civic Issue'}\n"
        f"- Specific Location Hint: {location_hint or 'As marked on map'}\n"
        f"- Observed Hazards: {', '.join(hazards) if hazards else 'Civic inconvenience'}\n\n"
        f"ACTION REQUESTED:\n"
        f"Inspection and prompt remedial action by the authorized municipal department."
    )

    tags = ["civic-issue", "mohallafix-verified"]
    if category:
        tags.append(category.lower().replace(" ", "-"))
    for h in hazards:
        tags.append(h.lower().replace(" ", "-").replace("/", ""))

    return WritingAssistantResponse(
        refined_title=refined_title,
        refined_description=refined_description,
        extracted_hazards=hazards,
        suggested_tags=tags[:5]
    )

