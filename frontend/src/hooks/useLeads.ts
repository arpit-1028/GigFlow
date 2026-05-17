import { useState, useEffect, useCallback } from 'react';
import type { ILead, LeadFilters, PaginationMeta } from '../types/index';
import * as leadsApi from '../api/leads.api';
import { useDebounce } from './useDebounce';

export const useLeads = (initialFilters: LeadFilters = {}) => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
    limit: 10,
    ...initialFilters,
  });
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search filter to avoid duplicate API calls
  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async (activeFilters: LeadFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await leadsApi.getLeads(activeFilters);
      if (response.success && response.data) {
        setLeads(response.data);
        if (response.meta) {
          setMeta(response.meta);
        }
      } else {
        setError(response.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch leads when filters (except raw search) or debouncedSearch changes
  useEffect(() => {
    const activeFilters = {
      ...filters,
      search: debouncedSearch,
    };
    fetchLeads(activeFilters);
  }, [
    filters.status,
    filters.source,
    filters.sort,
    filters.page,
    filters.limit,
    debouncedSearch,
    fetchLeads,
  ]);

  const handleCreateLead = async (leadData: Partial<ILead>) => {
    try {
      const response = await leadsApi.createLead(leadData);
      if (response.success && response.data) {
        // Refetch leads to keep UI synced
        fetchLeads({ ...filters, search: debouncedSearch });
        return response.data;
      }
      throw new Error(response.message || 'Failed to create lead');
    } catch (err: any) {
      throw new Error(err.message || 'Failed to create lead');
    }
  };

  const handleUpdateLead = async (id: string, leadData: Partial<ILead>) => {
    try {
      const response = await leadsApi.updateLead(id, leadData);
      if (response.success && response.data) {
        // Update local state directly to be fast, or refetch
        setLeads((prev) =>
          prev.map((lead) => (lead._id === id ? { ...lead, ...response.data } : lead))
        );
        return response.data;
      }
      throw new Error(response.message || 'Failed to update lead');
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update lead');
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const response = await leadsApi.deleteLead(id);
      if (response.success) {
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
      } else {
        throw new Error(response.message || 'Failed to delete lead');
      }
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete lead');
    }
  };

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => {
      // If updating a critical filter, reset page to 1
      const resetPage =
        newFilters.status !== undefined ||
        newFilters.source !== undefined ||
        newFilters.search !== undefined;

      return {
        ...prev,
        ...newFilters,
        page: resetPage ? 1 : newFilters.page ?? prev.page,
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      source: '',
      search: '',
      sort: 'latest',
      page: 1,
      limit: 10,
    });
  };

  return {
    leads,
    filters,
    meta,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    createLead: handleCreateLead,
    updateLead: handleUpdateLead,
    deleteLead: handleDeleteLead,
    refetch: () => fetchLeads({ ...filters, search: debouncedSearch }),
  };
};
