from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, SessionLocal, engine, ensure_forms_user_id_column
from .routers import auth as auth_router
from .routers import forms as forms_router
from .routers import public as public_router
from .services import auth_service

app = FastAPI(title="Tally Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_forms_user_id_column()
    db = SessionLocal()
    try:
        auth_service.ensure_demo_user(db)
    finally:
        db.close()


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(forms_router.router)
app.include_router(public_router.router)
app.include_router(auth_router.router)
