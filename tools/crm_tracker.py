"""
CRM Tracker Tool — Log leads and clients to Google Sheets (or local CSV fallback).
"""
import os
import csv
import time

CRM_CSV_PATH = os.getenv("CRM_CSV_PATH", "/app/memory/crm.csv")
CRM_COLUMNS = ["id", "name", "email", "phone", "company", "stage", "deal_value", "notes", "created_at", "updated_at"]


def track_crm_entry(
    name: str,
    email: str,
    stage: str = "lead",
    phone: str = "",
    company: str = "",
    deal_value: float = 0.0,
    notes: str = "",
) -> str:
    """
    Add or update a CRM entry.

    Args:
        name: Contact's full name
        email: Contact's email (used as unique key)
        stage: Pipeline stage (lead, prospect, proposal, client, closed)
        phone: Phone number
        company: Company name
        deal_value: Estimated deal value in USD
        notes: Free-form notes

    Returns:
        Confirmation message
    """
    os.makedirs(os.path.dirname(CRM_CSV_PATH), exist_ok=True)

    # Load existing entries
    entries: list[dict] = []
    if os.path.exists(CRM_CSV_PATH):
        with open(CRM_CSV_PATH, "r", newline="") as f:
            reader = csv.DictReader(f)
            entries = list(reader)

    # Check for existing entry by email
    now = str(time.time())
    existing_idx = next((i for i, e in enumerate(entries) if e.get("email") == email), None)

    entry = {
        "id": entries[existing_idx]["id"] if existing_idx is not None else f"crm_{len(entries)+1:04d}",
        "name": name,
        "email": email,
        "phone": phone,
        "company": company,
        "stage": stage,
        "deal_value": str(deal_value),
        "notes": notes,
        "created_at": entries[existing_idx]["created_at"] if existing_idx is not None else now,
        "updated_at": now,
    }

    if existing_idx is not None:
        entries[existing_idx] = entry
        action = "updated"
    else:
        entries.append(entry)
        action = "added"

    # Write back
    with open(CRM_CSV_PATH, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=CRM_COLUMNS)
        writer.writeheader()
        writer.writerows(entries)

    return f"CRM entry {action}: {name} ({email}) — Stage: {stage}"
