# HRMS Lite API Documentation

Base URL: `http://localhost:8000` (development) or your deployed backend URL

## Employee Management

### Create Employee
**POST** `/api/employees`

Creates a new employee record.

**Request Body:**
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering"
}
```

**Response:**
- **201 Created** - Employee created successfully
```json
{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "created_at": "2024-01-15T10:30:00"
}
```

- **409 Conflict** - Duplicate employee_id or email
```json
{
  "detail": "Employee with ID 'EMP001' already exists"
}
```

- **400 Bad Request** - Validation error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

### Get All Employees
**GET** `/api/employees`

Retrieves all employee records.

**Response:**
- **200 OK**
```json
[
  {
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "created_at": "2024-01-15T10:30:00"
  }
]
```

### Delete Employee
**DELETE** `/api/employees/{employee_id}`

Deletes an employee record.

**Response:**
- **204 No Content** - Employee deleted successfully
- **404 Not Found**
```json
{
  "detail": "Employee with ID 'EMP001' not found"
}
```

### Get Employee Summary
**GET** `/api/employees/{employee_id}/summary`

Gets attendance summary for a specific employee.

**Response:**
- **200 OK**
```json
{
  "total_present_days": 20,
  "total_absent_days": 5,
  "total_records": 25
}
```

- **404 Not Found**
```json
{
  "detail": "Employee with ID 'EMP001' not found"
}
```

## Attendance Management

### Mark Attendance
**POST** `/api/attendance`

Marks attendance for an employee.

**Request Body:**
```json
{
  "employee_id": "EMP001",
  "date": "2024-01-15",
  "status": "Present"
}
```

**Status Values:** `"Present"` or `"Absent"`

**Response:**
- **201 Created** - Attendance marked successfully
```json
{
  "id": 1,
  "employee_id": "EMP001",
  "date": "2024-01-15",
  "status": "Present"
}
```

- **404 Not Found** - Employee doesn't exist
```json
{
  "detail": "Employee with ID 'EMP001' not found"
}
```

- **409 Conflict** - Duplicate attendance record
```json
{
  "detail": "Attendance already marked for employee 'EMP001' on date '2024-01-15'"
}
```

- **400 Bad Request** - Validation error
```json
{
  "detail": [
    {
      "loc": ["body", "status"],
      "msg": "Input should be 'Present' or 'Absent'",
      "type": "literal_error"
    }
  ]
}
```

### Get Attendance Records
**GET** `/api/attendance/{employee_id}`

Gets attendance records for an employee, optionally filtered by date range.

**Query Parameters:**
- `start_date` (optional): Start date filter (YYYY-MM-DD)
- `end_date` (optional): End date filter (YYYY-MM-DD)

**Examples:**
- `/api/attendance/EMP001` - All records
- `/api/attendance/EMP001?start_date=2024-01-01` - Records from Jan 1
- `/api/attendance/EMP001?start_date=2024-01-01&end_date=2024-01-31` - Records in January

**Response:**
- **200 OK**
```json
[
  {
    "id": 1,
    "employee_id": "EMP001",
    "date": "2024-01-15",
    "status": "Present"
  },
  {
    "id": 2,
    "employee_id": "EMP001",
    "date": "2024-01-14",
    "status": "Absent"
  }
]
```

- **404 Not Found** - Employee doesn't exist
```json
{
  "detail": "Employee with ID 'EMP001' not found"
}
```

- **400 Bad Request** - Invalid date range
```json
{
  "detail": "Start date must be before or equal to end date"
}
```

## Dashboard

### Get Dashboard Summary
**GET** `/api/dashboard`

Gets system-wide summary statistics.

**Response:**
- **200 OK**
```json
{
  "total_employees": 10,
  "total_attendance_records": 250,
  "total_present": 200,
  "total_absent": 50
}
```

## Error Responses

All endpoints may return the following error responses:

- **400 Bad Request** - Validation errors or invalid input
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate record
- **500 Internal Server Error** - Server error

Error responses follow this format:
```json
{
  "detail": "Error message description"
}
```

For validation errors (400), the response may be an array:
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "Error message",
      "type": "error_type"
    }
  ]
}
```
