from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from ..db import get_db
from ..schemas import FormOut, SubmissionCreate, SubmissionOut
from ..services import form_service, submission_service

router = APIRouter(tags=["public"])


@router.get("/s/{share_id}", response_model=FormOut)
def get_form_by_share_id(
    share_id: str,
    request: Request,
    db: Session = Depends(get_db),
) -> FormOut:
    form = form_service.get_form_by_share_id(db, share_id)
    return form_service.form_to_out(form, request)


@router.post("/s/{share_id}/submissions", response_model=SubmissionOut)
def submit_form(
    share_id: str,
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
) -> SubmissionOut:
    return submission_service.create_submission_for_share(db, share_id, payload)
