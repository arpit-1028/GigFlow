import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from './ui/Spinner';
import { Layout } from './Layout';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'sales';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="auth-loading-screen">
        <Spinner size="lg" />
        <p className="auth-loading-text">Validating secure session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user && user.role !== requiredRole) {
    // If not admin, redirect to leads view
    return <Navigate to="/leads" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
