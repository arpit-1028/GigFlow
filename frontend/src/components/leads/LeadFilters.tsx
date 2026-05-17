import React from 'react';
import type { LeadFilters as FiltersType, LeadStatus, LeadSource } from '../../types/index';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface LeadFiltersProps {
  filters: FiltersType;
  onChange: (filters: Partial<FiltersType>) => void;
  onClear: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  return (
    <div className="filters-container">
      <div className="filters-search-wrapper">
        <Input
          type="text"
          placeholder="Search leads by name or email..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value })}
          leftIcon={<span className="search-icon">🔍</span>}
          className="filter-search-input"
        />
      </div>

      <div className="filters-row">
        <div className="filter-select-group">
          <label htmlFor="filter-status" className="sr-only">Status</label>
          <select
            id="filter-status"
            className="filter-select"
            value={filters.status || ''}
            onChange={(e) => onChange({ status: e.target.value as LeadStatus | '' })}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="filter-source" className="sr-only">Source</label>
          <select
            id="filter-source"
            className="filter-select"
            value={filters.source || ''}
            onChange={(e) => onChange({ source: e.target.value as LeadSource | '' })}
          >
            <option value="">All Sources</option>
            <option value="Website">Website</option>
            <option value="Instagram">Instagram</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        <div className="filter-select-group">
          <label htmlFor="filter-sort" className="sr-only">Sort Order</label>
          <select
            id="filter-sort"
            className="filter-select"
            value={filters.sort || 'latest'}
            onChange={(e) => onChange({ sort: e.target.value as 'latest' | 'oldest' })}
          >
            <option value="latest">Latest Leads</option>
            <option value="oldest">Oldest Leads</option>
          </select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="clear-filters-btn"
          disabled={!filters.search && !filters.status && !filters.source && filters.sort === 'latest'}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
