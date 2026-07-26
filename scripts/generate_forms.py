"""
generate_forms.py — Auto-generate Google Forms from JSON for all roles.

Uses raw HTTP requests (not google-api-python-client) to avoid serialisation issues.
Section headers are skipped — the API rejects them, so questions are added flat.
"""

import json
import sys
import requests as http_requests
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/forms.body"]
FORMS_DIR = Path(__file__).parent / "forms"


def get_headers():
    """Return authenticated HTTP headers."""
    creds = None
    token_path = Path.home() / ".google_forms_token.json"
    creds_path = Path(__file__).parent / "credentials.json"

    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not creds_path.exists():
                print(f"ERROR: credentials.json not found at {creds_path}")
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(creds_path), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w") as f:
            f.write(creds.to_json())

    creds.refresh(Request())
    return {
        "Authorization": f"Bearer {creds.token}",
        "Content-Type": "application/json",
    }


def build_question(q):
    """Build a question dict for the Google Forms API."""
    q_type = q.get("type", "TEXT")
    required = q.get("required", False)
    title = q.get("title", "")

    question = {"required": required}

    if q_type == "TEXT":
        question["textQuestion"] = {"paragraph": False}
    elif q_type == "PARAGRAPH":
        question["textQuestion"] = {"paragraph": True}
    elif q_type in ("MULTIPLE_CHOICE", "DROPDOWN", "CHECKBOXES"):
        options_raw = q.get("options", [])
        options = [{"value": o} if isinstance(o, str) else o for o in options_raw]
        choice_type = {"MULTIPLE_CHOICE": "RADIO", "DROPDOWN": "DROP_DOWN", "CHECKBOXES": "CHECKBOX"}[q_type]
        question["choiceQuestion"] = {"type": choice_type, "options": options}
    elif q_type == "LINEAR_SCALE":
        question["scaleQuestion"] = {
            "low": q.get("min", 1),
            "high": q.get("max", 5),
            "lowLabel": q.get("minLabel", ""),
            "highLabel": q.get("maxLabel", ""),
        }
    elif q_type == "DATE":
        question["dateQuestion"] = {}
    elif q_type == "TIME":
        question["timeQuestion"] = {}

    return {"title": title, "questionItem": {"question": question}}


def create_form_via_api(headers, form_def):
    """Create a Google Form via raw HTTP requests."""
    info = form_def.get("info", {})
    title = info.get("title", "Untitled")
    doc_title = info.get("documentTitle", title)

    # --- Step 1: Create the form ---
    create_body = {"info": {"title": title, "documentTitle": doc_title}}
    r = http_requests.post(
        "https://forms.googleapis.com/v1/forms",
        headers=headers,
        json=create_body,
    )
    if r.status_code != 200:
        print(f"  ERROR creating form: {r.status_code} {r.text}")
        return None

    form = r.json()
    form_id = form.get("formId")
    print(f"  Created form: {title}")
    print(f"  Form ID: {form_id}")

    # --- Step 2: Build batchUpdate requests ---
    # NOTE: sectionHeaderItem is rejected by the API, so we skip sections.
    # All questions are added as-is. Section titles are embedded as the
    # first question text in each group.
    sections = form_def.get("sections", [])
    requests = []

    for sec in sections:
        sec_title = sec.get("title", "")
        sec_desc = sec.get("description", "")

        # Add a text-only header line as a question (since sectionHeaderItem is not supported)
        # The first item in each section becomes a "section label" question
        requests.append({
            "createItem": {
                "item": {
                    "title": f">>> {sec_title} <<<",
                    "description": sec_desc,
                    "textItem": {},
                },
                "location": {"index": 0},
            }
        })

        # Questions
        for q in sec.get("questions", []):
            item = build_question(q)
            requests.append({
                "createItem": {
                    "item": item,
                    "location": {"index": 0},
                }
            })

    if not requests:
        print(f"  No questions to add.")
        url = f"https://docs.google.com/forms/d/{form_id}"
        print(f"  URL: {url}\n")
        return form

    update_body = {"requests": requests}
    r2 = http_requests.post(
        f"https://forms.googleapis.com/v1/forms/{form_id}:batchUpdate",
        headers=headers,
        json=update_body,
    )
    if r2.status_code != 200:
        print(f"  ERROR updating form: {r2.status_code}")
        print(f"  Response: {r2.text[:600]}...")
        print(f"  Form created but empty. URL: https://docs.google.com/forms/d/{form_id}\n")
        return form

    print(f"  OK - {len(sections)} section(s) with questions added")
    url = f"https://docs.google.com/forms/d/{form_id}"
    print(f"  URL: {url}\n")
    return form


def main():
    print("=" * 60)
    print("HARVEST - Google Forms Generator")
    print("=" * 60)

    print("\n[*] Authenticating...")
    headers = get_headers()
    print("[OK] Authenticated.\n")

    json_files = sorted(FORMS_DIR.glob("*.json"))
    if not json_files:
        print(f"ERROR: No .json files in {FORMS_DIR}")
        sys.exit(1)

    print(f"Found {len(json_files)} form definition(s):\n")

    results = []
    for jf in json_files:
        print(f"[*] Processing: {jf.name}")
        try:
            with open(jf, "r", encoding="utf-8") as f:
                form_def = json.load(f)
        except json.JSONDecodeError as e:
            print(f"  ERROR parsing JSON: {e}\n")
            continue

        result = create_form_via_api(headers, form_def)
        if result:
            results.append(result)

    print("=" * 60)
    print(f"SUMMARY: {len(results)}/{len(json_files)} form(s) created\n")
    for f in results:
        fid = f.get("formId")
        t = f.get("info", {}).get("title", "Untitled")
        print(f"  {t}")
        print(f"  https://docs.google.com/forms/d/{fid}\n")
    print("Done!")


if __name__ == "__main__":
    main()
