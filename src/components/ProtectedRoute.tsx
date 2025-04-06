import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to sign in if not authenticated
    return <Navigate to="/profile" replace />;
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute; 