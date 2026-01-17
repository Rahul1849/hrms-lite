from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.routers import employees, attendance, dashboard
import os

app = FastAPI(
    title="HRMS Lite API",
    description="A lightweight HRMS application for employee and attendance management",
    version="1.0.0"
)

# CORS configuration
# For production, allow all origins (restrict for better security in real deployments)
# For development, allow localhost origins
if os.getenv("ENVIRONMENT") == "production":
    origins = ["*"]
else:
    origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True if origins != ["*"] else False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/")
def root():
    return {"message": "HRMS Lite API is running", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
