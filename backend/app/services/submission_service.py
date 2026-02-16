import os

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..models import Form, Submission
from ..schemas import SubmissionCreate
from ..services.submission_validation import validate_submission


def list_submissions_for_form(
    db: Session,
    form_id: int,
    user_id: int,
) -> list[Submission]:
    form = (
        db.query(Form)
        .filter(Form.id == form_id, Form.user_id == user_id)
        .first()
    )
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

    validate_submission(form.blocks or [], payload.data)

    submission = Submission(form_id=form.id, data=payload.data)
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


# PAYMENT FEATURE DISABLED - Stripe integration commented out
# def create_payment_session_for_share(
#     db: Session,
#     share_id: str,
#     block_id: str,
# ) -> dict:
#     try:
#         import stripe
#     except ModuleNotFoundError as exc:
#         raise HTTPException(
#             status_code=500,
#             detail="Stripe package is not installed. Run pip install stripe.",
#         ) from exc
#     form = db.query(Form).filter(Form.share_id == share_id).first()
#     if not form:
#         raise HTTPException(status_code=404, detail="Form not found")
#
#     block = next((b for b in (form.blocks or []) if b.get("id") == block_id), None)
#     if not block or block.get("type") != "payment":
#         raise HTTPException(status_code=404, detail="Payment block not found")
#
#     secret_key = os.getenv("STRIPE_SECRET_KEY")
#     success_url = os.getenv("STRIPE_SUCCESS_URL")
#     cancel_url = os.getenv("STRIPE_CANCEL_URL")
#     if not secret_key or not success_url or not cancel_url:
#         raise HTTPException(status_code=500, detail="Stripe is not configured")
#
#     stripe.api_key = secret_key
#     amount = block.get("paymentAmount", 0)
#     currency = (block.get("paymentCurrency") or "USD").lower()
#     description = block.get("paymentDescription") or "Payment"
#
#     if float(amount) <= 0:
#         raise HTTPException(status_code=422, detail="Payment amount is invalid")
#
#     session = stripe.checkout.Session.create(
#         mode="payment",
#         success_url=success_url,
#         cancel_url=cancel_url,
#         line_items=[
#             {
#                 "price_data": {
#                     "currency": currency,
#                     "unit_amount": int(float(amount) * 100),
#                     "product_data": {"name": description},
#                 },
#                 "quantity": 1,
#             }
#         ],
#         metadata={"form_id": str(form.id), "block_id": block_id},
#     )
#
#     return {"id": session.id, "url": session.url}

