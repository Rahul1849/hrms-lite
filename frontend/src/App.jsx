import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

function MobileNavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${
        isActive
          ? 'border-indigo-500 text-gray-900 bg-indigo-50'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
      } block px-3 py-2 rounded-md text-base font-medium border-l-4`}
    >
      {children}
    </Link>
  );
}

function DesktopNavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`${
        isActive
          ? 'border-indigo-500 text-gray-900'
          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
    >
      {children}
    </Link>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">HRMS Lite</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <DesktopNavLink to="/">Dashboard</DesktopNavLink>
                  <DesktopNavLink to="/employees">Employees</DesktopNavLink>
                  <DesktopNavLink to="/attendance">Attendance</DesktopNavLink>
                </div>
              </div>
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1 px-2">
                <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                <MobileNavLink to="/employees" onClick={() => setMobileMenuOpen(false)}>Employees</MobileNavLink>
                <MobileNavLink to="/attendance" onClick={() => setMobileMenuOpen(false)}>Attendance</MobileNavLink>
              </div>
            </div>
          )}
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
