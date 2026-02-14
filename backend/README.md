# Tally.so Clone Backend

FastAPI + SQLite backend for storing forms and form submissions.

## Quick start

1. Create and activate a virtual environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Run the API:

   uvicorn app.main:app --reload

The API will be available at http://127.0.0.1:8000.

## Endpoints

- POST /forms
- GET /forms
- GET /forms/{form_id}
- PATCH /forms/{form_id}
- DELETE /forms/{form_id}
- GET /forms/{form_id}/share
- GET /forms/{form_id}/submissions
- GET /s/{share_id}
- POST /s/{share_id}/submissions

## Notes

- Form blocks are stored as JSON based on the frontend structure.
- Submissions store arbitrary JSON data keyed by block IDs.
