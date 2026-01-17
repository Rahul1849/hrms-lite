import axios from 'axios';
import * as mockAPI from './mockApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Check if we should use mock data (when API_URL is not localhost or when explicitly set)
const isLocalhost = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || (!isLocalhost && !API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 2000, // 2 second timeout for faster fallback
});

// Helper to handle API calls with automatic fallback to mock
const apiCall = async (realCall, mockCall) => {
  if (USE_MOCK) {
    return mockCall();
  }
  
  try {
    return await realCall();
  } catch (error) {
    // If backend is not available, fall back to mock data
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
      console.log('Backend not available, using mock data');
      return mockCall();
    }
    throw error;
  }
};

// Employee APIs
export const employeeAPI = {
  getAll: () => apiCall(
    () => api.get('/api/employees'),
    () => mockAPI.mockEmployeeAPI.getAll()
  ),
  create: (data) => apiCall(
    () => api.post('/api/employees', data),
    () => mockAPI.mockEmployeeAPI.create(data)
  ),
  delete: (employeeId) => apiCall(
    () => api.delete(`/api/employees/${employeeId}`),
    () => mockAPI.mockEmployeeAPI.delete(employeeId)
  ),
  getSummary: (employeeId) => apiCall(
    () => api.get(`/api/employees/${employeeId}/summary`),
    () => mockAPI.mockEmployeeAPI.getSummary(employeeId)
  ),
};

// Attendance APIs
export const attendanceAPI = {
  create: (data) => apiCall(
    () => api.post('/api/attendance', data),
    () => mockAPI.mockAttendanceAPI.create(data)
  ),
  getByEmployee: (employeeId, startDate = null, endDate = null) => {
    const realCall = () => {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      return api.get(`/api/attendance/${employeeId}`, { params });
    };
    return apiCall(
      realCall,
      () => mockAPI.mockAttendanceAPI.getByEmployee(employeeId, startDate, endDate)
    );
  },
};

// Dashboard API
export const dashboardAPI = {
  getSummary: () => apiCall(
    () => api.get('/api/dashboard'),
    () => mockAPI.mockDashboardAPI.getSummary()
  ),
};

export default api;
