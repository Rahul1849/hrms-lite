# HRMS Lite Backend

FastAPI backend for the HRMS Lite application.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

- `DATABASE_URL` - SQLite database path (default: `sqlite:///./hrms.db`)
- `ENVIRONMENT` - Set to `production` for production (default: `development`)
