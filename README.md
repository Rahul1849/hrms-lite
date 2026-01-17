# HRMS Lite - Full-Stack Employee & Attendance Management System

A production-ready, lightweight HRMS application built with React and FastAPI for managing employees and attendance records.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router DOM** - Client-side routing

### Backend
- **Python 3.9+** - Programming language
- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation using Python type annotations
- **SQLite** - File-based database (persistent storage)

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway

## 📋 Features

### Core Functionality

1. **Employee Management**
   - Create employees with validation (employee_id, full_name, email, department)
   - View all employees in a table
   - Delete employees
   - Email format validation
   - Duplicate employee_id prevention

2. **Attendance Management**
   - Mark attendance (Present/Absent) for employees
   - View attendance history per employee
   - Date picker for selecting attendance date
   - Prevent duplicate attendance records for same employee + date

### Bonus Features

3. **Date Range Filter**
   - Filter attendance records by start and end date
   - Query parameter support: `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`

4. **Employee Summary**
   - Get attendance summary per employee
   - Returns: total_present_days, total_absent_days, total_records
   - Endpoint: `GET /api/employees/{employee_id}/summary`

5. **Dashboard Summary**
   - System-wide statistics
   - Total employees, attendance records, present/absent counts
   - Endpoint: `GET /api/dashboard`

## 🏗️ Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entry point
│   │   ├── database.py           # Database configuration
│   │   ├── models/               # SQLAlchemy models
│   │   │   ├── employee.py
│   │   │   └── attendance.py
│   │   ├── schemas/              # Pydantic schemas
│   │   │   ├── employee.py
│   │   │   ├── attendance.py
│   │   │   └── dashboard.py
│   │   └── routers/              # API route handlers
│   │       ├── employees.py
│   │       ├── attendance.py
│   │       └── dashboard.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/           # Reusable components
    │   ├── pages/                # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Employees.jsx
    │   │   └── Attendance.jsx
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx               # Main app component with routing
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Global styles with Tailwind
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

## 🛠️ Local Development Setup

### Prerequisites
- Python 3.9 or higher
- Node.js 18 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
   - **Windows**: `venv\Scripts\activate`
   - **Linux/Mac**: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file (optional, defaults work for local):
```bash
cp .env.example .env
```

6. Run the server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
VITE_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📡 API Endpoints

### Employee Management

- `POST /api/employees` - Create a new employee
  - Body: `{ employee_id, full_name, email, department }`
  - Returns: 201 Created or 409 Conflict (duplicate)

- `GET /api/employees` - Get all employees
  - Returns: List of employees

- `DELETE /api/employees/{employee_id}` - Delete an employee
  - Returns: 204 No Content or 404 Not Found

- `GET /api/employees/{employee_id}/summary` - Get employee attendance summary
  - Returns: `{ total_present_days, total_absent_days, total_records }`

### Attendance Management

- `POST /api/attendance` - Mark attendance
  - Body: `{ employee_id, date (YYYY-MM-DD), status ("Present"|"Absent") }`
  - Returns: 201 Created or 409 Conflict (duplicate)

- `GET /api/attendance/{employee_id}` - Get attendance records
  - Query params: `?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` (optional)
  - Returns: List of attendance records

### Dashboard

- `GET /api/dashboard` - Get dashboard summary
  - Returns: `{ total_employees, total_attendance_records, total_present, total_absent }`

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Prepare for deployment:**
   - Ensure `requirements.txt` is up to date
   - Set environment variables:
     - `DATABASE_URL` (SQLite file path, e.g., `sqlite:///./hrms.db`)
     - `ENVIRONMENT=production`

2. **Render:**
   - Connect your GitHub repository
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables in Render dashboard
   - Note: For SQLite persistence, ensure the database file path is writable

3. **Railway:**
   - Connect your GitHub repository
   - Railway will auto-detect Python
   - Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables in Railway dashboard

### Frontend Deployment (Vercel/Netlify)

1. **Prepare for deployment:**
   - Set `VITE_API_URL` environment variable to your deployed backend URL
   - Build the project: `npm run build`

2. **Vercel:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.com`

3. **Netlify:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url.com`

### Environment Variables

**Backend:**
- `DATABASE_URL` - SQLite database path (default: `sqlite:///./hrms.db`)
- `ENVIRONMENT` - Set to `production` for production deployment

**Frontend:**
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## ✅ Validation & Error Handling

### Backend
- Pydantic schemas validate all request data
- HTTP status codes:
  - `400` - Validation errors
  - `404` - Resource not found
  - `409` - Duplicate records
  - `500` - Server errors
- Clear, descriptive error messages

### Frontend
- Form validation
- Loading states for async operations
- Error message display
- Empty states for no data
- Disabled buttons during API calls

## 🗄️ Database Schema

### Employees Table
- `employee_id` (String, Primary Key, Unique)
- `full_name` (String, Required)
- `email` (String, Required, Unique)
- `department` (String, Required)
- `created_at` (DateTime, Auto-generated)

### Attendance Table
- `id` (Integer, Primary Key, Auto-increment)
- `employee_id` (String, Foreign Key → employees.employee_id)
- `date` (Date, Required)
- `status` (String, Required: "Present" or "Absent")
- Unique constraint on (`employee_id`, `date`)

## 🔒 CORS Configuration

CORS is configured to allow:
- Local development: `http://localhost:5173`, `http://localhost:3000`
- Production: Vercel and Netlify domains
- Configurable via `ENVIRONMENT` variable

## 📝 Assumptions & Limitations

1. **SQLite Database**: 
   - File-based SQLite is used for simplicity
   - For production at scale,  we can consider PostgreSQL or MySQL
   - Database file persists in the deployment environment

2. **Authentication**: 
   - Not implemented (as per requirements)
   - Suitable for internal/private use

3. **Date Format**: 
   - All dates use ISO format (YYYY-MM-DD)
   - Timezone handling is simplified (UTC)

4. **Email Validation**: 
   - Basic email format validation via Pydantic
   - No email verification required

5. **Employee ID**: 
   - Assumed to be provided by the user
   - No auto-generation logic

## 🧪 Testing the Application

1. **Create Employees:**
   - Navigate to Employees page
   - Fill in the form and submit
   - Verify employee appears in the table

2. **Mark Attendance:**
   - Navigate to Attendance page
   - Select employee, date, and status
   - Submit and verify in history

3. **View Dashboard:**
   - Navigate to Dashboard
   - Verify summary statistics update correctly

4. **Test Date Filter:**
   - Select an employee in Attendance page
   - Set start and end dates
   - Verify filtered results

## 📄 License

This project is built as a coding assignment.

## 👨‍💻 Development Notes

- All code is production-ready with no TODOs
- Clean architecture with separation of concerns
- Proper error handling and validation throughout
- Responsive design for mobile and desktop
- Follows best practices for React and FastAPI
