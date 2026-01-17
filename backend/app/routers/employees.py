from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import get_db
from app.models.employee import Employee
from app.models.attendance import Attendance
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.schemas.dashboard import EmployeeSummary
from datetime import date

router = APIRouter(prefix="/api/employees", tags=["employees"])

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    """Create a new employee"""
    try:
        db_employee = Employee(
            employee_id=employee.employee_id,
            full_name=employee.full_name,
            email=employee.email,
            department=employee.department
        )
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee
    except IntegrityError as e:
        db.rollback()
        if "UNIQUE constraint failed: employees.employee_id" in str(e) or "employee_id" in str(e):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with ID '{employee.employee_id}' already exists"
            )
        elif "email" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with email '{employee.email}' already exists"
            )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Duplicate employee record"
        )

@router.get("", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    """Get all employees"""
    employees = db.query(Employee).all()
    return employees

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    """Delete an employee"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    db.delete(employee)
    db.commit()
    return None

@router.get("/{employee_id}/summary", response_model=EmployeeSummary)
def get_employee_summary(employee_id: str, db: Session = Depends(get_db)):
    """Get attendance summary for a specific employee"""
    employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    attendance_records = db.query(Attendance).filter(Attendance.employee_id == employee_id).all()
    
    total_present = sum(1 for record in attendance_records if record.status == "Present")
    total_absent = sum(1 for record in attendance_records if record.status == "Absent")
    
    return EmployeeSummary(
        total_present_days=total_present,
        total_absent_days=total_absent,
        total_records=len(attendance_records)
    )
