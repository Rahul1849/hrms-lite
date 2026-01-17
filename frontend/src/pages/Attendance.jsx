import { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api';

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formWarning, setFormWarning] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployee) {
      fetchAttendanceRecords();
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedEmployee, startDate, endDate]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    if (!selectedEmployee) return;

    try {
      setLoadingRecords(true);
      const response = await attendanceAPI.getByEmployee(
        selectedEmployee,
        startDate || null,
        endDate || null
      );
      setAttendanceRecords(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch attendance records');
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFormSuccess(null);
    setFormWarning(null);

    try {
      await attendanceAPI.create(formData);
      setFormSuccess('Attendance marked successfully!');
      setFormData({
        employee_id: formData.employee_id,
        date: new Date().toISOString().split('T')[0],
        status: '',
      });
      if (selectedEmployee === formData.employee_id) {
        fetchAttendanceRecords();
      }
      // Clear success message after 3 seconds
      setTimeout(() => setFormSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to mark attendance';
      // Check if it's a duplicate/conflict error (409)
      if (err.response?.status === 409 || errorMessage.includes('already marked')) {
        setFormWarning(errorMessage);
      } else {
        setFormError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmployeeSelect = (e) => {
    setSelectedEmployee(e.target.value);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        <p className="mt-1 text-sm text-gray-500">Mark and view attendance records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mark Attendance</h3>
          
          {formSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {formSuccess}
            </div>
          )}
          {formWarning && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
              {formWarning}
            </div>
          )}
          {formError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                  Employee *
                </label>
                <select
                  id="employee_id"
                  name="employee_id"
                  required
                  value={formData.employee_id}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.full_name} ({employee.employee_id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                >
                  <option value="">Select status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Marking...' : 'Mark Attendance'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance History</h3>
          
          <div className="mb-4 space-y-3">
            <div>
              <label htmlFor="view_employee" className="block text-sm font-medium text-gray-700 mb-2">
                Select Employee
              </label>
              <select
                id="view_employee"
                value={selectedEmployee}
                onChange={handleEmployeeSelect}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.full_name} ({employee.employee_id})
                  </option>
                ))}
              </select>
            </div>

            {selectedEmployee && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="start_date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      id="end_date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                  </div>
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    Clear Filters
                  </button>
                )}
              </>
            )}
          </div>

          {loading && employees.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading employees...</div>
          ) : !selectedEmployee ? (
            <div className="text-center py-8 text-gray-500">Select an employee to view attendance history</div>
          ) : loadingRecords ? (
            <div className="text-center py-8 text-gray-500">Loading attendance records...</div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : attendanceRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No attendance records found for this employee.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceRecords.map((record) => (
                    <tr key={record.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === 'Present'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Attendance;
