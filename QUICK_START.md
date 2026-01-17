# Quick Start Guide

## Local Development

### Backend (Terminal 1)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API Docs: http://localhost:8000/docs

### Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Testing the Application

1. **Create Employees**
   - Go to Employees page
   - Fill form: Employee ID, Name, Email, Department
   - Submit and verify in table

2. **Mark Attendance**
   - Go to Attendance page
   - Select employee, date, and status (Present/Absent)
   - Submit

3. **View Dashboard**
   - Go to Dashboard page
   - See summary statistics

4. **Filter Attendance**
   - In Attendance page, select an employee
   - Set start_date and end_date filters
   - View filtered results

## Key Features Implemented

✅ Employee CRUD operations
✅ Attendance marking with validation
✅ Date range filtering
✅ Employee summary statistics
✅ Dashboard overview
✅ Error handling and validation
✅ Loading states
✅ Responsive design

## Deployment Checklist

### Backend
- [ ] Set `ENVIRONMENT=production`
- [ ] Set `DATABASE_URL` (SQLite file path)
- [ ] Deploy to Render/Railway
- [ ] Note the backend URL

### Frontend
- [ ] Set `VITE_API_URL` to deployed backend URL
- [ ] Build: `npm run build`
- [ ] Deploy to Vercel/Netlify

## Environment Variables

**Backend:**
- `DATABASE_URL=sqlite:///./hrms.db`
- `ENVIRONMENT=production`

**Frontend:**
- `VITE_API_URL=https://your-backend-url.com`
