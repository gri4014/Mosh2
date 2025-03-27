import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import SubscriptionSelection from './components/SubscriptionSelection'; // Import SubscriptionSelection
import Settings from './components/Settings'; // Import the Settings component
import './App.css';

// Basic check for authentication token (replace with context/state management later)
const isAuthenticated = () => !!localStorage.getItem('token');

// Simple ProtectedRoute component (can be enhanced later)
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />;
};


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing/Login/Signup Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route
            path="/subscribe"
            element={
              <ProtectedRoute>
                <SubscriptionSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings" // Add the settings route
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Add other routes here */}

          {/* Optional: Redirect authenticated users from landing page */}
          {/* <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LandingPage />} /> */}

        </Routes>
      </div>
    </Router>
  );
}

export default App;
