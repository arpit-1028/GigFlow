import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/auth/RegisterForm';
import type { RegisterPayload } from '../types/index';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (data: RegisterPayload) => {
    await register(data);
    // After register, retrieve user role to redirect appropriately
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
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          onNavigateToLogin={() => navigate('/login')}
        />
      </div>
    </div>
  );
};
export default RegisterPage;
