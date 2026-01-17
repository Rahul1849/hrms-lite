import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get('/api/employees'),
  create: (data) => api.post('/api/employees', data),
  delete: (employeeId) => api.delete(`/api/employees/${employeeId}`),
  getSummary: (employeeId) => api.get(`/api/employees/${employeeId}/summary`),
};

// Attendance APIs
export const attendanceAPI = {
  create: (data) => api.post('/api/attendance', data),
  getByEmployee: (employeeId, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return api.get(`/api/attendance/${employeeId}`, { params });
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => api.get('/api/dashboard'),
};

export default api;
