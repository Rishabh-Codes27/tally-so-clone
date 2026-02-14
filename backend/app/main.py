from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine, get_db
from .routers import forms as forms_router
from .routers import public as public_router

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


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(forms_router.router)
app.include_router(public_router.router)
