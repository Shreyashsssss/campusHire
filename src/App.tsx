import React from 'react';
import { useAuth, AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './auth/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import ATSResumeScorer from './components/ATSResumeScorer';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center text-primary-600">Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};



// Wrap with AuthProvider inside App component? No, AuthProvider needs to be outside Routes if Navbar depends on it
// Correct pattern:
const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  </Router>
);

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <PrivateRoute>
              <Applications />
            </PrivateRoute>
          }
        />
        <Route
          path="/ats-scorer"
          element={
            <PrivateRoute>
              <ATSResumeScorer />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
