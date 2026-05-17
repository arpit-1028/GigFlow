import api from './axios';
import type { ILead, ApiResponse, LeadFilters, DashboardStats } from '../types/index';

export const getLeads = async (filters: LeadFilters = {}): Promise<ApiResponse<ILead[]>> => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);
  if (filters.search) params.append('search', filters.search);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const response = await api.get<ApiResponse<ILead[]>>(`/leads?${params.toString()}`);
  return response.data;
};

export const createLead = async (leadData: Partial<ILead>): Promise<ApiResponse<ILead>> => {
  const response = await api.post<ApiResponse<ILead>>('/leads', leadData);
  return response.data;
};

export const getLeadById = async (id: string): Promise<ApiResponse<ILead>> => {
  const response = await api.get<ApiResponse<ILead>>(`/leads/${id}`);
  return response.data;
};

export const updateLead = async (id: string, leadData: Partial<ILead>): Promise<ApiResponse<ILead>> => {
  const response = await api.put<ApiResponse<ILead>>(`/leads/${id}`, leadData);
  return response.data;
};

export const deleteLead = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete<ApiResponse<{ message: string }>>(`/leads/${id}`);
  return response.data;
};

export const getStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await api.get<ApiResponse<DashboardStats>>('/leads/stats');
  return response.data;
};

export const exportLeadsCSV = async (filters: LeadFilters = {}): Promise<string> => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.source) params.append('source', filters.source);
  if (filters.search) params.append('search', filters.search);

  const response = await api.get<string>(`/leads/export?${params.toString()}`, {
    responseType: 'text',
  });
  return response.data;
};
