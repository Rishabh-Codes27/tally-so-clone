from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models import Form, Submission
from ..schemas import SubmissionCreate


def list_submissions_for_form(db: Session, form_id: int) -> list[Submission]:
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    return (
        db.query(Submission)
        .filter(Submission.form_id == form_id)
        .order_by(Submission.created_at.desc())
        .all()
    )


def create_submission_for_share(
    db: Session,
    share_id: str,
    payload: SubmissionCreate,
) -> Submission:
    form = db.query(Form).filter(Form.share_id == share_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")

    submission = Submission(form_id=form.id, data=payload.data)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission
