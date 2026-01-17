from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    department = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with attendance
    attendance_records = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
