#!/bin/bash
# Startup script for backend

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
