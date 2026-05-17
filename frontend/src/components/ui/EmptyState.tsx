import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No leads found',
  description = 'Try adjusting your search query, clearing your filters, or adding a new lead.',
  onClearFilters,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {onClearFilters && (
        <Button variant="secondary" onClick={onClearFilters} className="empty-state-cta">
          Clear Filters
        </Button>
      )}
    </div>
  );
};
