"""
generate_forms.py — Auto-generate Google Forms from JSON for all roles.

Usage:
    1. Setup Google Forms API credentials (see README_SETUP.md)
    2. pip install -r requirements.txt
    3. python generate_forms.py

What it does:
    - Reads all .json files from ./forms/
    - Creates a Google Form per JSON file via the Forms API
    - Prints the URL of each created form
"""

import json
import os
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

SCOPES = ["https://www.googleapis.com/auth/forms.body"]

FORMS_DIR = Path(__file__).parent / "forms"

QUESTION_TYPES = {
    "TEXT": "TEXT",
    "PARAGRAPH": "PARAGRAPH_TEXT",
    "MULTIPLE_CHOICE": "RADIO",
    "CHECKBOXES": "CHECKBOX",
    "DROPDOWN": "DROP_DOWN",
    "LINEAR_SCALE": "LINEAR_SCALE",
    "DATE": "DATE",
    "TIME": "TIME",
}


def get_authenticated_service():
    """Authenticate and return the Google Forms service."""
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
                print(
                    f"ERROR: credentials.json not found at {creds_path}.\n"
                    "Download it from Google Cloud Console → APIs & Services → Credentials\n"
                    "→ OAuth 2.0 Client IDs → Web application → download JSON."
                )
                sys.exit(1)
            flow = InstalledAppFlow.from_client_secrets_file(str(creds_path), SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w") as token_file:
            token_file.write(creds.to_json())

    return build("forms", "v1", credentials=creds)


def create_question(question_data):
    """Build a Google Forms API request item for a single question."""
    q_type = question_data.get("type", "TEXT")
    required = question_data.get("required", False)
    title = question_data.get("title", "")
    api_type = QUESTION_TYPES.get(q_type, "TEXT")

    item = {
        "title": title,
        "questionItem": {
            "question": {
                "required": required,
            }
        },
    }

    # Handle different question types
    if q_type in ("MULTIPLE_CHOICE", "DROPDOWN"):
        options_raw = question_data.get("options", [])
        options = []
        for opt in options_raw:
            if isinstance(opt, str):
                options.append({"value": opt})
            elif isinstance(opt, dict):
                options.append(opt)
        item["questionItem"]["question"]["choiceQuestion"] = {
            "type": "RADIO" if q_type == "MULTIPLE_CHOICE" else "DROP_DOWN",
            "options": options,
        }

    elif q_type == "CHECKBOXES":
        options_raw = question_data.get("options", [])
        options = []
        for opt in options_raw:
            if isinstance(opt, str):
                options.append({"value": opt})
            elif isinstance(opt, dict):
                options.append(opt)
        item["questionItem"]["question"]["choiceQuestion"] = {
            "type": "CHECKBOX",
            "options": options,
        }

    elif q_type == "LINEAR_SCALE":
        item["questionItem"]["question"]["scaleQuestion"] = {
            "low": question_data.get("min", 1),
            "high": question_data.get("max", 5),
            "lowLabel": question_data.get("minLabel", ""),
            "highLabel": question_data.get("maxLabel", ""),
        }
        api_type = "LINEAR_SCALE"

    elif q_type == "PARAGRAPH":
        api_type = "PARAGRAPH_TEXT"

    elif q_type == "DATE":
        api_type = "DATE"
        item["questionItem"]["question"]["dateQuestion"] = {}

    elif q_type == "TIME":
        api_type = "TIME"
        item["questionItem"]["question"]["timeQuestion"] = {}

    item["questionItem"]["question"]["questionType"] = api_type

    return item


def create_section(section_data):
    """
    Build requests for a form section.
    First item is a section header, then each question.
    """
    requests = []

    section_title = section_data.get("title", "")
    section_desc = section_data.get("description", "")

    # Section header item
    requests.append({
        "createItem": {
            "item": {
                "title": section_title,
                "description": section_desc,
                "sectionHeaderItem": {"type": "SECTION_HEADER"},
            },
            "location": {"index": 0},
        }
    })

    # Questions in this section
    questions = section_data.get("questions", [])
    for q in questions:
        item = create_question(q)
        requests.append({
            "createItem": {
                "item": item,
                "location": {"index": 0},
            }
        })

    return requests


def create_form(service, form_def):
    """Create a Google Form from a JSON definition."""
    info = form_def.get("info", {})
    title = info.get("title", "Untitled Form")
    doc_title = info.get("documentTitle", title)

    # Step 1: Create the form
    form = {
        "info": {
            "title": title,
            "documentTitle": doc_title,
        }
    }

    try:
        result = service.forms().create(body=form).execute()
        form_id = result.get("formId")
        print(f"  Created form: {title}")
        print(f"  Form ID: {form_id}")
    except HttpError as e:
        print(f"  ERROR creating form '{title}': {e}")
        return None

    # Step 2: Add sections and questions
    sections = form_def.get("sections", [])
    all_requests = []

    for section in sections:
        all_requests.extend(create_section(section))

    if all_requests:
        body = {"requests": all_requests}
        try:
            service.forms().batchUpdate(formId=form_id, body=body).execute()
            print(f"  Added {len(sections)} section(s) and questions to form")
        except HttpError as e:
            print(f"  ERROR updating form '{title}': {e}")
            print(f"  Form was created but may be incomplete. URL: https://docs.google.com/forms/d/{form_id}")
            return result

    # Print the form URL
    form_url = f"https://docs.google.com/forms/d/{form_id}"
    print(f"  URL: {form_url}\n")
    return result


def main():
    print("=" * 60)
    print("Sembako-Chain AI — Google Forms Generator")
    print("=" * 60)

    # Authenticate
    print("\n[*] Authenticating with Google Forms API...")
    service = get_authenticated_service()
    print("[OK] Authenticated.\n")

    # Find all JSON form definitions
    if not FORMS_DIR.exists():
        print(f"ERROR: Directory '{FORMS_DIR}' not found.")
        print(f"Create it and add JSON files (e.g., petani.json)")
        sys.exit(1)

    json_files = sorted(FORMS_DIR.glob("*.json"))
    if not json_files:
        print(f"ERROR: No .json files found in '{FORMS_DIR}'.")
        print("Add at least one form definition file (e.g., petani.json)")
        sys.exit(1)

    print(f"Found {len(json_files)} form definition(s):\n")

    created_forms = []
    for jf in json_files:
        print(f"[*] Processing: {jf.name}")
        try:
            with open(jf, "r", encoding="utf-8") as f:
                form_def = json.load(f)
        except json.JSONDecodeError as e:
            print(f"  ERROR parsing JSON: {e}\n")
            continue

        result = create_form(service, form_def)
        if result:
            created_forms.append(result)

    # Summary
    print("=" * 60)
    print(f"SUMMARY: {len(created_forms)}/{len(json_files)} form(s) created successfully\n")
    for f in created_forms:
        fid = f.get("formId")
        title = f.get("info", {}).get("title", "Untitled")
        print(f"  {title}")
        print(f"  https://docs.google.com/forms/d/{fid}\n")

    print("Done! Open the URLs above to view/edit your forms.")
    print("=" * 60)


if __name__ == "__main__":
    main()
