from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

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
    return form_service.form_to_out(form, request)


@router.get("", response_model=list[FormOut])
def list_forms(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> list[FormOut]:
    forms = form_service.list_forms(db, current_user.id)
    return [form_service.form_to_out(form, request) for form in forms]


@router.get("/{form_id}", response_model=FormOut)
def get_form(
    form_id: int,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.get_form_by_id(db, form_id, current_user.id)
    return form_service.form_to_out(form, request)


@router.patch("/{form_id}", response_model=FormOut)
def update_form(
    form_id: int,
    payload: FormUpdate,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.update_form(db, form_id, payload, current_user.id)
    return form_service.form_to_out(form, request)


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
