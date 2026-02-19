import os

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def ensure_forms_user_id_column() -> None:
    if not DATABASE_URL.startswith("sqlite"):
        return

    with engine.connect() as connection:
        result = connection.execute(text("PRAGMA table_info(forms)"))
        columns = {row[1] for row in result.fetchall()}
        if "user_id" not in columns:
            connection.execute(text("ALTER TABLE forms ADD COLUMN user_id INTEGER"))
            connection.commit()
        if "logo_url" not in columns:
            connection.execute(text("ALTER TABLE forms ADD COLUMN logo_url VARCHAR(512) DEFAULT ''"))
            connection.commit()
        if "cover_url" not in columns:
            connection.execute(text("ALTER TABLE forms ADD COLUMN cover_url VARCHAR(512) DEFAULT ''"))
            connection.commit()
        if "cover_height" not in columns:
            connection.execute(text("ALTER TABLE forms ADD COLUMN cover_height INTEGER DEFAULT 200"))
            connection.commit()
