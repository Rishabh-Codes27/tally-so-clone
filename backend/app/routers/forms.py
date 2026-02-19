from fastapi import APIRouter, Depends, Request, status, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
from ..db import get_db
from ..models import User
from ..routers.auth import get_current_user, get_optional_user
from ..schemas import FormCreate, FormOut, FormUpdate, SubmissionOut
from ..services import form_service, submission_service

router = APIRouter(prefix="/forms", tags=["forms"])


@router.post("", response_model=FormOut, status_code=status.HTTP_201_CREATED)
def create_form(
    payload: FormCreate,
    request: Request,
    current_user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> FormOut:
    user_id = current_user.id if current_user else None
    form = form_service.create_form(db, payload, user_id)
    return form_service.form_to_out(form, request, db)


@router.get("", response_model=list[FormOut])
def list_forms(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FormOut]:
    forms = form_service.list_forms(db, current_user.id)
    return [form_service.form_to_out(form, request, db) for form in forms]


@router.get("/{form_id}", response_model=FormOut)
def get_form(
    form_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.get_form_by_id(db, form_id, current_user.id)
    return form_service.form_to_out(form, request, db)


@router.patch("/{form_id}", response_model=FormOut)
def update_form(
    form_id: int,
    payload: FormUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.update_form(db, form_id, payload, current_user.id)
    return form_service.form_to_out(form, request, db)


@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    form_service.delete_form(db, form_id, current_user.id)
    return None


@router.get("/{form_id}/share")
def get_form_share(
    form_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    return form_service.get_form_share(db, form_id, request, current_user.id)


@router.get("/{form_id}/submissions", response_model=list[SubmissionOut])
def list_submissions(
    form_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[SubmissionOut]:
    return submission_service.list_submissions_for_form(db, form_id, current_user.id)


@router.post("/{form_id}/logo")
async def upload_form_logo(
    form_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Upload a logo for a form. Max file size: 1MB. Allowed types: PNG, JPG, GIF, SVG."""
    # Validate file size (1MB max)
    MAX_FILE_SIZE = 1 * 1024 * 1024  # 1MB
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"File size exceeds maximum of 1MB")
    
    # Validate file type
    allowed_types = {"image/png", "image/jpeg", "image/gif", "image/svg+xml"}
    if file.content_type not in allowed_types:
        raise ValueError(f"File type not allowed. Allowed types: PNG, JPG, GIF, SVG")
    
    # Create uploads directory if it doesn't exist
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(uploads_dir, unique_filename)
    
    # Save file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Store the file path in the form
    form = form_service.get_form_by_id(db, form_id, current_user.id)
    form.logo_url = f"/uploads/{unique_filename}"
    db.commit()
    
    return {"logo_url": form.logo_url}


@router.post("/{form_id}/cover")
async def upload_form_cover(
    form_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Upload a cover for a form. Max file size: 10MB. Allowed types: PNG, JPG, GIF, SVG."""
    # Validate file size (10MB max)
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError(f"File size exceeds maximum of 10MB")
    
    # Validate file type
    allowed_types = {"image/png", "image/jpeg", "image/gif", "image/svg+xml"}
    if file.content_type not in allowed_types:
        raise ValueError(f"File type not allowed. Allowed types: PNG, JPG, GIF, SVG")
    
    # Create uploads directory if it doesn't exist
    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(uploads_dir, unique_filename)
    
    # Save file
    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)
    
    # Store the file path in the form
    form = form_service.get_form_by_id(db, form_id, current_user.id)
    form.cover_url = f"/uploads/{unique_filename}"
    db.commit()
    
    return {"cover_url": form.cover_url}

