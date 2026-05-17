import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/auth/LoginForm';
import type { LoginPayload } from '../types/index';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';

  const handleLoginSubmit = async (data: LoginPayload) => {
    await login(data);
    // After login, retrieve user role to redirect appropriately
    const storedUser = localStorage.getItem('gigflow_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'admin') {
          navigate('/dashboard');
          return;
        }
      } catch {
        // fail silently
      }
    }
    navigate('/leads');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-brand-side">
        <div className="auth-brand-logo-container">
          <span className="brand-logo-large">⚡</span>
          <h1 className="auth-brand-title">GigFlow</h1>
        </div>
        <p className="auth-brand-description">
          The smart lead acquisition, classification, and routing engine for agency workflows.
          Seamlessly manage sales funnels and drive growth with granular metrics.
        </p>
        <div className="auth-brand-footer">
          © {new Date().getFullYear()} GigFlow Inc. All rights reserved.
        </div>
      </div>

      <div className="auth-form-side">
        {isExpired && (
          <div className="auth-expired-banner">
            🔑 Session expired. Please sign in again.
          </div>
        )}
        <LoginForm
          onSubmit={handleLoginSubmit}
          onNavigateToRegister={() => navigate('/register')}
        />
      </div>
    </div>
  );
};
export default LoginPage;
