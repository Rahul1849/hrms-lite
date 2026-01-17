from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import UniqueConstraint
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, ForeignKey("employees.employee_id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(String, nullable=False)  # "Present" or "Absent"

    # Relationship with employee
    employee = relationship("Employee", back_populates="attendance_records")

    # Unique constraint: one attendance record per employee per date
    __table_args__ = (UniqueConstraint("employee_id", "date", name="unique_employee_date"),)
