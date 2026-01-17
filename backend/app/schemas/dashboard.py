from pydantic import BaseModel

class EmployeeSummary(BaseModel):
    total_present_days: int
    total_absent_days: int
    total_records: int

class DashboardSummary(BaseModel):
    total_employees: int
    total_attendance_records: int
    total_present: int
    total_absent: int
