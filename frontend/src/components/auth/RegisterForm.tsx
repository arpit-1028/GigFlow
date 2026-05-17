import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { RegisterPayload } from '../../types/index';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'sales'] as const).default('sales'),
});

interface RegisterFormProps {
  onSubmit: (data: RegisterPayload) => Promise<void>;
  onNavigateToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onNavigateToLogin,
}) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'sales',
    },
  });

  const selectedRole = watch('role');

  const handleFormSubmit = async (data: RegisterPayload) => {
    setApiError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Email might be in use.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className="auth-form-title">Create Account</h2>
      <p className="auth-form-subtitle">Register to starting routing and tracking leads</p>

      {apiError && (
        <div className="auth-error-banner" role="alert">
          {apiError}
        </div>
      )}

      <Input
        label="Full Name"
        type="text"
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="email@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="input-group-container">
        <label className="input-label">Account Role</label>
        <div className="role-selector-group">
          <button
            type="button"
            className={`role-selector-btn ${selectedRole === 'sales' ? 'active' : ''}`}
            onClick={() => setValue('role', 'sales')}
          >
            <div className="role-btn-title">💼 Sales Rep</div>
            <div className="role-btn-desc">Add, view, and update own active lead pipeline</div>
          </button>
          <button
            type="button"
            className={`role-selector-btn ${selectedRole === 'admin' ? 'active' : ''}`}
            onClick={() => setValue('role', 'admin')}
          >
            <div className="role-btn-title">🔑 Administrator</div>
            <div className="role-btn-desc">Full dashboard system statistics, CRUD access and CSV export</div>
          </button>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-4"
        isLoading={isSubmitting}
      >
        Sign Up
      </Button>

      <div className="auth-form-footer">
        <span>Already have an account?</span>
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="auth-link-btn"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};
