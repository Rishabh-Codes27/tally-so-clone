import re
from typing import Any
from urllib.parse import urlparse

from fastapi import HTTPException

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
PHONE_PATTERN = re.compile(r"^[+0-9()\s-]{6,}$")
DATE_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
TIME_PATTERN = re.compile(r"^\d{2}:\d{2}$")


def _is_empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str):
        return value.strip() == ""
    if isinstance(value, list):
        return len(value) == 0
    if isinstance(value, dict):
        return len(value) == 0
    return False


def _is_valid_url(value: str) -> bool:
    try:
        parsed = urlparse(value)
        return parsed.scheme in {"http", "https"} and bool(parsed.netloc)
    except Exception:
        return False


def _matches_allowed_type(file_type: str, allowed: list[str], file_name: str | None) -> bool:
    if not allowed:
        return True
    lower_name = (file_name or "").lower()
    ext = lower_name.split(".")[-1] if "." in lower_name else ""
    for entry in allowed:
        normalized = entry.strip().lower()
        if not normalized:
            continue
        if normalized.endswith("/*"):
            prefix = normalized[:-1]
            if file_type.startswith(prefix):
                return True
            continue
        if "/" in normalized:
            if file_type == normalized:
                return True
            continue
        if not ext:
            continue
        if normalized.startswith("."):
            if f".{ext}" == normalized:
                return True
            continue
        if ext == normalized:
            return True
    return False


def validate_submission(blocks: list[dict], data: dict) -> None:
    errors: list[dict] = []

    for block in blocks:
        block_id = block.get("id")
        block_type = block.get("type")
        required = bool(block.get("required"))
        value = data.get(block_id)

        if block_type in {"payment", "wallet-connect"}:
            # PAYMENT AND WALLET-CONNECT DISABLED - Skipping validation
            continue

        if required and _is_empty(value):
            errors.append({"block_id": block_id, "message": "This field is required."})
            continue

        if _is_empty(value):
            continue

        if block_type in {
            "short-answer",
            "long-answer",
            "text",
            "paragraph",
            "title",
            "label",
            "thank-you-page",
        }:
            if not isinstance(value, str):
                errors.append({"block_id": block_id, "message": "Must be text."})
        elif block_type == "email":
            if not isinstance(value, str) or not EMAIL_PATTERN.match(value):
                errors.append({"block_id": block_id, "message": "Enter a valid email."})
        elif block_type == "number":
            if isinstance(value, (int, float)):
                pass
            elif isinstance(value, str):
                try:
                    float(value)
                except ValueError:
                    errors.append({"block_id": block_id, "message": "Enter a valid number."})
            else:
                errors.append({"block_id": block_id, "message": "Enter a valid number."})
        elif block_type == "url":
            if not isinstance(value, str) or not _is_valid_url(value):
                errors.append({"block_id": block_id, "message": "Enter a valid URL."})
        elif block_type == "phone":
            if not isinstance(value, str) or not PHONE_PATTERN.match(value):
                errors.append(
                    {"block_id": block_id, "message": "Enter a valid phone number."}
                )
        elif block_type == "date":
            if not isinstance(value, str) or not DATE_PATTERN.match(value):
                errors.append({"block_id": block_id, "message": "Enter a valid date."})
        elif block_type == "time":
            if not isinstance(value, str) or not TIME_PATTERN.match(value):
                errors.append({"block_id": block_id, "message": "Enter a valid time."})
        elif block_type in {"multiple-choice", "dropdown"}:
            options = block.get("options") or []
            if not isinstance(value, str) or value not in options:
                errors.append({"block_id": block_id, "message": "Select a valid option."})
        elif block_type in {"checkboxes", "multi-select"}:
            options = set(block.get("options") or [])
            if not isinstance(value, list) or not all(
                isinstance(item, str) and item in options for item in value
            ):
                errors.append({"block_id": block_id, "message": "Select valid options."})
        elif block_type == "linear-scale":
            scale_min = block.get("scaleMin", 1)
            scale_max = block.get("scaleMax", 5)
            try:
                numeric = float(value)
            except (TypeError, ValueError):
                errors.append({"block_id": block_id, "message": "Select a valid value."})
                continue
            if numeric < scale_min or numeric > scale_max:
                errors.append({"block_id": block_id, "message": "Select a valid value."})
        elif block_type == "rating":
            rating_max = block.get("ratingMax", 5)
            try:
                numeric = float(value)
            except (TypeError, ValueError):
                errors.append({"block_id": block_id, "message": "Select a valid rating."})
                continue
            if numeric < 1 or numeric > rating_max:
                errors.append({"block_id": block_id, "message": "Select a valid rating."})
        elif block_type == "matrix":
            if not isinstance(value, dict):
                errors.append({"block_id": block_id, "message": "Complete the matrix."})
                continue
            rows = block.get("rows") or []
            columns = set(block.get("columns") or [])
            for row in rows:
                selected = value.get(row)
                if required and (not selected or selected not in columns):
                    errors.append({"block_id": block_id, "message": "Complete the matrix."})
                    break
                if selected and selected not in columns:
                    errors.append({"block_id": block_id, "message": "Select valid options."})
                    break
        elif block_type == "ranking":
            options = block.get("options") or []
            if not isinstance(value, list):
                errors.append({"block_id": block_id, "message": "Provide a ranking."})
                continue
            if len(set(value)) != len(value) or not all(
                isinstance(item, str) and item in options for item in value
            ):
                errors.append({"block_id": block_id, "message": "Provide a valid ranking."})
        elif block_type == "file-upload":
            if not isinstance(value, dict):
                errors.append({"block_id": block_id, "message": "Upload a valid file."})
                continue
            file_name = value.get("name")
            file_type = value.get("type")
            file_data = value.get("data")
            file_size = value.get("size")
            if not file_name or not file_type or not file_data or not isinstance(file_data, str):
                errors.append({"block_id": block_id, "message": "Upload a valid file."})
                continue
            max_bytes = 1 * 1024 * 1024
            if isinstance(file_size, (int, float)) and file_size > max_bytes:
                errors.append({"block_id": block_id, "message": "File exceeds size limit."})
                continue
            allowed = block.get("fileAllowedTypes") or []
            if not _matches_allowed_type(file_type, allowed, file_name):
                errors.append({"block_id": block_id, "message": "File type not allowed."})
        elif block_type == "signature":
            if not isinstance(value, str) or not value.startswith("data:image/"):
                errors.append({"block_id": block_id, "message": "Add a signature."})
        # elif block_type == "payment":
        #     # PAYMENT DISABLED - Validation commented out
        #     if not isinstance(value, dict):
        #         errors.append({"block_id": block_id, "message": "Payment is required."})
        #         continue
        #     status = value.get("status")
        #     if status not in {"pending", "paid"}:
        #         errors.append({"block_id": block_id, "message": "Payment is required."})
        # elif block_type == "wallet-connect":
        #     # WALLET-CONNECT DISABLED - Validation commented out
        #     if not isinstance(value, dict) or not value.get("address"):
        #         errors.append({"block_id": block_id, "message": "Connect a wallet."})
        elif block_type == "respondent-country":
            if not isinstance(value, str):
                errors.append({"block_id": block_id, "message": "Country is required."})
        elif block_type == "recaptcha":
            if value != "verified":
                errors.append({"block_id": block_id, "message": "Verify reCAPTCHA."})
        elif block_type == "hidden-field":
            if not isinstance(value, str):
                errors.append({"block_id": block_id, "message": "Hidden field is invalid."})

    if errors:
        raise HTTPException(status_code=422, detail={"errors": errors})
