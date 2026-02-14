from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Form, Submission, User

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/users")
def list_users(db: Session = Depends(get_db)) -> dict:
    users = db.query(User).all()
    return {
        "count": len(users),
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "created_at": str(u.created_at),
            }
            for u in users
        ],
    }


@router.get("/forms")
def list_all_forms(db: Session = Depends(get_db)) -> dict:
    forms = db.query(Form).all()
    return {
        "count": len(forms),
        "forms": [
            {
                "id": f.id,
                "user_id": f.user_id,
                "title": f.title,
                "share_id": f.share_id,
                "created_at": str(f.created_at),
            }
            for f in forms
        ],
    }


@router.get("/submissions")
def list_all_submissions(db: Session = Depends(get_db)) -> dict:
    submissions = db.query(Submission).all()
    return {
        "count": len(submissions),
        "submissions": [
            {
                "id": s.id,
                "form_id": s.form_id,
                "created_at": str(s.created_at),
                "data": s.data,
            }
            for s in submissions
        ],
    }
