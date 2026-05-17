import React from 'react';
import type { ILead } from '../../types/index';
import { Badge } from '../ui/Badge';

interface LeadCardProps {
  lead: ILead;
  onClick?: () => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'New':
        return 'primary';
      case 'Contacted':
        return 'warning';
      case 'Qualified':
        return 'success';
      case 'Lost':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getSourceEmoji = (source: string) => {
    switch (source) {
      case 'Website':
        return '🌐';
      case 'Instagram':
        return '📸';
      case 'Referral':
        return '🤝';
      default:
        return '📄';
    }
  };

  const creatorName = typeof lead.createdBy === 'object' && lead.createdBy ? lead.createdBy.name : 'Unknown';

  return (
    <div className="lead-card" onClick={onClick}>
      <div className="lead-card-header">
        <h4 className="lead-card-name">{lead.name}</h4>
        <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
      </div>
      <div className="lead-card-body">
        <div className="lead-card-info-row">
          <span className="lead-card-icon">✉️</span>
          <span className="lead-card-text truncate">{lead.email}</span>
        </div>
        <div className="lead-card-info-row">
          <span className="lead-card-icon">{getSourceEmoji(lead.source)}</span>
          <span className="lead-card-text">{lead.source}</span>
        </div>
        {lead.notes && (
          <p className="lead-card-notes truncate">{lead.notes}</p>
        )}
      </div>
      <div className="lead-card-footer">
        <span className="lead-card-owner">Owner: {creatorName}</span>
        <span className="lead-card-date">
          {new Date(lead.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
