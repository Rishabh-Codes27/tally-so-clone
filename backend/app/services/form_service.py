from datetime import datetime
from typing import Optional
import secrets

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from ..models import Form, Submission
from ..schemas import FormCreate, FormOut, FormUpdate


def generate_share_id() -> str:
    return secrets.token_urlsafe(8)


def build_share_url(request: Request, share_id: str) -> str:
    base = str(request.base_url).rstrip("/")
    return f"{base}/s/{share_id}"


def form_to_out(form: Form, request: Request, db: Session | None = None) -> FormOut:
    response_count = 0
    if db:
        response_count = db.query(Submission).filter(Submission.form_id == form.id).count()
    
    return FormOut(
        id=form.id,
        title=form.title,
        blocks=form.blocks or [],
        share_id=form.share_id,
        share_url=build_share_url(request, form.share_id),
        response_count=response_count,
        created_at=form.created_at,
        updated_at=form.updated_at,
    )


def create_form(db: Session, payload: FormCreate, user_id: Optional[int]) -> Form:
    share_id = generate_share_id()
    while db.query(Form).filter(Form.share_id == share_id).first():
        share_id = generate_share_id()

    form = Form(
        user_id=user_id,
        title=payload.title,
        blocks=[block.model_dump() for block in payload.blocks],
        share_id=share_id,
    )
    db.add(form)
    db.commit()
    db.refresh(form)
    return form


def list_forms(db: Session, user_id: int) -> list[Form]:
    return (
        db.query(Form)
        .filter(Form.user_id == user_id)
        .order_by(Form.created_at.desc())
        .all()
    )


def get_form_by_id(db: Session, form_id: int, user_id: int) -> Form:
    form = (
        db.query(Form)
        .filter(Form.id == form_id, Form.user_id == user_id)
        .first()
    )
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


def get_form_by_share_id(db: Session, share_id: str) -> Form:
    form = db.query(Form).filter(Form.share_id == share_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    return form


def update_form(db: Session, form_id: int, payload: FormUpdate, user_id: int) -> Form:
    form = get_form_by_id(db, form_id, user_id)

    if payload.title is not None:
        form.title = payload.title
    if payload.blocks is not None:
        form.blocks = [block.model_dump() for block in payload.blocks]
    form.updated_at = datetime.utcnow()

    db.add(form)
    db.commit()
    db.refresh(form)
    return form


def delete_form(db: Session, form_id: int, user_id: int) -> None:
    form = get_form_by_id(db, form_id, user_id)
    db.delete(form)
    db.commit()


def get_form_share(db: Session, form_id: int, request: Request, user_id: int) -> dict:
    form = get_form_by_id(db, form_id, user_id)
    return {
        "share_id": form.share_id,
        "share_url": build_share_url(request, form.share_id),
    }
