import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from "./Pages/Home";
import Add from "./Pages/Add";
import List from "./Pages/List";
import Orders from "./Pages/Orders";
import Dashboard from './Pages/Dashboard';
import LeadManagement from './Pages/Lead';
import AdminLogin from './Pages/Login';

const App = () => {
  const url = import.meta.env.VITE_PUBLIC_BACKEND_URL; 

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      
      if (token && adminData) {
        // Optional: Verify token with backend
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsAuthenticated(false);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // Public Route Component (only accessible when not authenticated)
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (isAuthenticated) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, show login
  if (!isAuthenticated && location.pathname !== '/login') {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
        />
        <Routes>
          <Route 
            path="/login" 
            element={
              <AdminLogin 
                url={url} 
                onLoginSuccess={() => setIsAuthenticated(true)}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    );
  }

  // If not authenticated, show only login page
  if (!isAuthenticated) {
    return (
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
        />
        <PublicRoute>
          <AdminLogin 
            url={url} 
            onLoginSuccess={() => setIsAuthenticated(true)}
          />
        </PublicRoute>
      </div>
    );
  }

  // If authenticated, show full app layout
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
      />
      
      <ProtectedRoute>
        <Navbar onLogout={handleLogout} />
        <hr />
        <div className='app-content'>
          <Sidebar />
          <div className='main-content'> 
            <Routes>
              <Route path="/dashboard" element={<Dashboard url={url} />} />
              <Route path="/" element={<Home url={url} />} />
              <Route path='/add' element={<Add url={url} />} />
              <Route path='/list' element={<List url={url} />} />
              <Route path='/orders' element={<Orders url={url} />} />
              <Route path='/leads' element={<LeadManagement url={url} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default App;