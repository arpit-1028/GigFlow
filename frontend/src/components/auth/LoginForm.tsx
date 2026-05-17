import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { LoginPayload } from '../../types/index';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface LoginFormProps {
  onSubmit: (data: LoginPayload) => Promise<void>;
  onNavigateToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onNavigateToRegister,
}) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginPayload) => {
    setApiError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className="auth-form-title">Welcome Back</h2>
      <p className="auth-form-subtitle">Log in to manage your smart leads dashboard</p>

      {apiError && (
        <div className="auth-error-banner" role="alert">
          {apiError}
        </div>
      )}

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

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-4"
        isLoading={isSubmitting}
      >
        Sign In
      </Button>

      <div className="auth-form-footer">
        <span>Don't have an account?</span>
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="auth-link-btn"
        >
          Create account
        </button>
      </div>
    </form>
  );
};
