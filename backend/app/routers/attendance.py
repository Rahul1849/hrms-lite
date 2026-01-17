from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from datetime import date
from typing import Optional

router = APIRouter(prefix="/api/attendance", tags=["attendance"])

@router.post("", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def create_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    # Validate status
    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be either 'Present' or 'Absent'"
        )
    
    # Validate employee exists
    employee = db.query(Employee).filter(Employee.employee_id == attendance.employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    try:
        db_attendance = Attendance(
            employee_id=attendance.employee_id,
            date=attendance.date,
            status=attendance.status
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for employee '{attendance.employee_id}' on date '{attendance.date}'"
        )

@router.get("/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(
    employee_id: str,
    start_date: Optional[date] = Query(None, description="Start date filter (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date filter (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """Get attendance records for an employee, optionally filtered by date range"""
    # Validate employee exists
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    query = db.query(Attendance).filter(Attendance.employee_id == employee_id)
    
    if start_date:
        query = query.filter(Attendance.date >= start_date)
    
    if end_date:
        query = query.filter(Attendance.date <= end_date)
    
    # Validate date range
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start date must be before or equal to end date"
        )
    
    attendance_records = query.order_by(Attendance.date.desc()).all()
    return attendance_records
