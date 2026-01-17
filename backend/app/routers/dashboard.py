from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """Get dashboard summary statistics"""
    total_employees = db.query(Employee).count()
    
    total_attendance_records = db.query(Attendance).count()
    
    total_present = db.query(Attendance).filter(Attendance.status == "Present").count()
    
    total_absent = db.query(Attendance).filter(Attendance.status == "Absent").count()
    
    return DashboardSummary(
        total_employees=total_employees,
        total_attendance_records=total_attendance_records,
        total_present=total_present,
        total_absent=total_absent
    )
