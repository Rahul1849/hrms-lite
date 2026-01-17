// Mock API service for frontend-only deployment
// This provides dummy data when backend is not available

// Storage keys
const STORAGE_EMPLOYEES = 'hrms_mock_employees';
const STORAGE_ATTENDANCE = 'hrms_mock_attendance';

// Initialize empty default data (fresh start, no pre-populated data)
const defaultEmployees = [];
const defaultAttendance = {};

// Load data from localStorage or use defaults
const loadEmployees = () => {
  try {
    const stored = localStorage.getItem(STORAGE_EMPLOYEES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load employees from localStorage', e);
  }
  return JSON.parse(JSON.stringify(defaultEmployees));
};

const loadAttendance = () => {
  try {
    const stored = localStorage.getItem(STORAGE_ATTENDANCE);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load attendance from localStorage', e);
  }
  return JSON.parse(JSON.stringify(defaultAttendance));
};

// Save to localStorage
const saveEmployees = (employees) => {
  try {
    localStorage.setItem(STORAGE_EMPLOYEES, JSON.stringify(employees));
  } catch (e) {
    console.warn('Failed to save employees to localStorage', e);
  }
};

const saveAttendance = (attendance) => {
  try {
    localStorage.setItem(STORAGE_ATTENDANCE, JSON.stringify(attendance));
  } catch (e) {
    console.warn('Failed to save attendance to localStorage', e);
  }
};

// Get current data
let mockEmployees = loadEmployees();
let mockAttendance = loadAttendance();

// Minimal delay for smooth UX (50ms - barely noticeable but prevents UI flicker)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockEmployeeAPI = {
  getAll: async () => {
    await delay(50);
    mockEmployees = loadEmployees();
    return { data: [...mockEmployees] };
  },
  create: async (data) => {
    await delay(50);
    mockEmployees = loadEmployees();
    const newEmployee = {
      ...data,
      created_at: new Date().toISOString()
    };
    mockEmployees.push(newEmployee);
    saveEmployees(mockEmployees);
    return { data: newEmployee };
  },
  delete: async (employeeId) => {
    await delay(50);
    mockEmployees = loadEmployees();
    mockAttendance = loadAttendance();
    const index = mockEmployees.findIndex(emp => emp.employee_id === employeeId);
    if (index > -1) {
      mockEmployees.splice(index, 1);
      delete mockAttendance[employeeId];
      saveEmployees(mockEmployees);
      saveAttendance(mockAttendance);
    }
    return { data: null };
  },
  getSummary: async (employeeId) => {
    await delay(50);
    mockAttendance = loadAttendance();
    const records = mockAttendance[employeeId] || [];
    const total_present = records.filter(r => r.status === 'Present').length;
    const total_absent = records.filter(r => r.status === 'Absent').length;
    return {
      data: {
        total_present_days: total_present,
        total_absent_days: total_absent,
        total_records: records.length
      }
    };
  }
};

export const mockAttendanceAPI = {
  create: async (data) => {
    await delay(50);
    mockAttendance = loadAttendance();
    // Check if already exists
    const existing = (mockAttendance[data.employee_id] || []).find(
      r => r.date === data.date
    );
    if (existing) {
      const error = new Error('Attendance already marked');
      error.response = {
        status: 409,
        data: { detail: `Attendance already marked for employee '${data.employee_id}' on date '${data.date}'` }
      };
      throw error;
    }
    
    const newRecord = {
      id: Date.now(),
      ...data
    };
    if (!mockAttendance[data.employee_id]) {
      mockAttendance[data.employee_id] = [];
    }
    mockAttendance[data.employee_id].push(newRecord);
    saveAttendance(mockAttendance);
    return { data: newRecord };
  },
  getByEmployee: async (employeeId, startDate = null, endDate = null) => {
    await delay(50);
    mockAttendance = loadAttendance();
    let records = [...(mockAttendance[employeeId] || [])];
    
    if (startDate) {
      records = records.filter(r => r.date >= startDate);
    }
    if (endDate) {
      records = records.filter(r => r.date <= endDate);
    }
    
    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    return { data: records };
  }
};

export const mockDashboardAPI = {
  getSummary: async () => {
    await delay(50);
    mockEmployees = loadEmployees();
    mockAttendance = loadAttendance();
    let total_present = 0;
    let total_absent = 0;
    
    Object.values(mockAttendance).forEach(records => {
      records.forEach(record => {
        if (record.status === 'Present') total_present++;
        else if (record.status === 'Absent') total_absent++;
      });
    });
    
    return {
      data: {
        total_employees: mockEmployees.length,
        total_attendance_records: total_present + total_absent,
        total_present: total_present,
        total_absent: total_absent
      }
    };
  }
};
