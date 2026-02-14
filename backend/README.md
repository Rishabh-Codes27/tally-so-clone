# Tally.so Clone Backend

FastAPI + SQLite backend with JWT authentication for form management and submissions.

## Features

- **User Authentication**: JWT-based signup/login with bcrypt password hashing
- **Form Management**: Create, update, delete, and share forms (with optional user ownership)
- **Anonymous Forms**: Forms can be created without sign-in
- **Submissions**: Collect and view form responses
- **Debug Endpoints**: Development endpoints for database inspection

## Quick Start

1. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the API:
   ```bash
   uvicorn app.main:app --reload
   ```

The API will be available at http://127.0.0.1:8000.  
Interactive docs: http://127.0.0.1:8000/docs

## API Endpoints

### Authentication

- `POST /auth/register` - Create new user account (returns JWT)
- `POST /auth/login` - Login with username/password (form-data, returns JWT)
- `GET /auth/me` - Get current user info (requires auth)

### Forms (Protected endpoints require Authorization header)

- `POST /forms` - Create form (optional auth - if authenticated, assigns user_id)
- `GET /forms` - List user's forms (requires auth)
- `GET /forms/{form_id}` - Get form by ID (requires auth, owner only)
- `PATCH /forms/{form_id}` - Update form (requires auth, owner only)
- `DELETE /forms/{form_id}` - Delete form (requires auth, owner only)
- `GET /forms/{form_id}/share` - Get share URL (requires auth, owner only)
- `GET /forms/{form_id}/submissions` - List submissions (requires auth, owner only)

### Public

- `GET /s/{share_id}` - Get form by share ID (public, no auth)
- `POST /s/{share_id}/submissions` - Submit form response (public, no auth)

### Debug (Development only)

- `GET /debug/users` - List all users
- `GET /debug/forms` - List all forms with ownership
- `GET /debug/submissions` - List all submissions

### Health

- `GET /health` - Health check endpoint

## Database Schema

### Users

- `id` - Primary key
- `username` - Unique username
- `hashed_password` - Hashed password (pbkdf2_sha256)
- `created_at` - Timestamp

### Forms

- `id` - Primary key
- `user_id` - Foreign key to users (nullable - for anonymous forms)
- `title` - Form title
- `blocks` - JSON array of form blocks
- `share_id` - Unique share identifier
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Submissions

- `id` - Primary key
- `form_id` - Foreign key to forms
- `data` - JSON object with answers (keyed by block IDs)
- `created_at` - Timestamp

## Demo Account

A demo user is automatically seeded on startup:

- **Username**: `test-user`
- **Password**: `test-user`

## Deployment

### Railway

1. Push to GitHub
2. Connect Railway to your repo
3. Set root directory to `/backend`
4. Railway auto-detects FastAPI and runs with the start command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Environment Variables

- `DATABASE_URL` - Database connection string (defaults to SQLite)
- `JWT_SECRET` - JWT secret key (defaults to "dev-secret" - change in production)

## Notes

- SQLite is ephemeral on Railway free tier - data resets on restarts
- For production persistence, use Railway PostgreSQL addon
- Form blocks are stored as JSON based on frontend block types
- Submissions store arbitrary JSON data keyed by block IDs
- Anonymous forms have `user_id = NULL`
