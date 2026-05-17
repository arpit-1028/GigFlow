import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { ILead, LeadStatus, LeadSource } from '../../types/index';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const leadSchema = z.object({
  name: z.string().trim().min(1, 'Lead name is required'),
  email: z.string().trim().email('Please enter a valid email address'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost'] as const).default('New'),
  source: z.enum(['Website', 'Instagram', 'Referral'] as const),
  notes: z.string().optional(),
});

type LeadFormValues = {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
};

interface LeadFormProps {
  initialValues?: Partial<ILead>;
  onSubmit: (data: LeadFormValues) => Promise<void>;
  buttonText?: string;
  onCancel?: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialValues,
  onSubmit,
  buttonText = 'Save Lead',
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      name: initialValues?.name || '',
      email: initialValues?.email || '',
      status: initialValues?.status || 'New',
      source: initialValues?.source || 'Website',
      notes: initialValues?.notes || '',
    },
  });

  const selectedSource = watch('source');
  const selectedStatus = watch('status');

  const handleFormSubmit = async (data: LeadFormValues) => {
    await onSubmit(data);
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Input
        label="Lead Contact Name"
        type="text"
        placeholder="Client Name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="client@company.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <div className="input-group-container">
        <label className="input-label">Lead Acquisition Source</label>
        <div className="radio-pill-group">
          {(['Website', 'Instagram', 'Referral'] as LeadSource[]).map((source) => (
            <button
              key={source}
              type="button"
              className={`radio-pill-btn ${selectedSource === source ? 'active' : ''}`}
              onClick={() => setValue('source', source)}
            >
              {source === 'Website' && '🌐 Website'}
              {source === 'Instagram' && '📸 Instagram'}
              {source === 'Referral' && '🤝 Referral'}
            </button>
          ))}
        </div>
        {errors.source && <span className="input-error-msg">{errors.source.message}</span>}
      </div>

      <div className="input-group-container">
        <label className="input-label">Pipeline Status</label>
        <div className="radio-pill-group">
          {(['New', 'Contacted', 'Qualified', 'Lost'] as LeadStatus[]).map((status) => (
            <button
              key={status}
              type="button"
              className={`radio-pill-btn status-${status.toLowerCase()} ${selectedStatus === status ? 'active' : ''}`}
              onClick={() => setValue('status', status)}
            >
              {status}
            </button>
          ))}
        </div>
        {errors.status && <span className="input-error-msg">{errors.status.message}</span>}
      </div>

      <div className="input-group-container">
        <label htmlFor="notes" className="input-label">Notes & Requirements</label>
        <textarea
          id="notes"
          className="form-textarea"
          placeholder="Enter details about this lead..."
          rows={3}
          {...register('notes')}
        />
        {errors.notes && <span className="input-error-msg">{errors.notes.message}</span>}
      </div>

      <div className="lead-form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
