from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, description="Full name of the employee")
    email: EmailStr = Field(..., description="Valid email address")
    department: str = Field(..., min_length=1, description="Department name")

class EmployeeResponse(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    class Config:
        from_attributes = True
