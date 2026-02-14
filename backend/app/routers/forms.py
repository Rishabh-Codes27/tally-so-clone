from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas import FormCreate, FormOut, FormUpdate, SubmissionOut
from ..services import form_service, submission_service

router = APIRouter(prefix="/forms", tags=["forms"])


@router.post("", response_model=FormOut, status_code=status.HTTP_201_CREATED)
def create_form(
    payload: FormCreate,
    request: Request,
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.create_form(db, payload)
    return form_service.form_to_out(form, request)


@router.get("", response_model=list[FormOut])
def list_forms(
    request: Request,
    db: Session = Depends(get_db),
) -> list[FormOut]:
    forms = form_service.list_forms(db)
    return [form_service.form_to_out(form, request) for form in forms]


@router.get("/{form_id}", response_model=FormOut)
def get_form(
    form_id: int,
    request: Request,
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.get_form_by_id(db, form_id)
    return form_service.form_to_out(form, request)


@router.patch("/{form_id}", response_model=FormOut)
def update_form(
    form_id: int,
    payload: FormUpdate,
    request: Request,
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.update_form(db, form_id, payload)
    return form_service.form_to_out(form, request)


@router.delete("/{form_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_form(
    form_id: int,
    db: Session = Depends(get_db),
) -> None:
    form_service.delete_form(db, form_id)
    return None


@router.get("/{form_id}/share")
def get_form_share(
    form_id: int,
    request: Request,
    db: Session = Depends(get_db),
) -> dict:
    return form_service.get_form_share(db, form_id, request)


@router.get("/{form_id}/submissions", response_model=list[SubmissionOut])
def list_submissions(
    form_id: int,
    db: Session = Depends(get_db),
) -> list[SubmissionOut]:
    return submission_service.list_submissions_for_form(db, form_id)
