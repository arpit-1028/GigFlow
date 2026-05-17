import React from 'react';
import type { ILead, UserRole } from '../../types/index';
import { Badge } from '../ui/Badge';

interface LeadTableProps {
  leads: ILead[];
  isLoading: boolean;
  userRole?: UserRole;
  onRowClick: (leadId: string) => void;
  onDeleteClick?: (leadId: string, event: React.MouseEvent) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  userRole,
  onRowClick,
  onDeleteClick,
}) => {
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
        return '🌐 Website';
      case 'Instagram':
        return '📸 Instagram';
      case 'Referral':
        return '🤝 Referral';
      default:
        return '📄 Other';
    }
  };

  if (isLoading) {
    return (
      <div className="table-responsive">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Source</th>
              <th>Created At</th>
              <th>Owner</th>
              {userRole === 'admin' && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="skeleton-row">
                <td><div className="skeleton skeleton-text"></div></td>
                <td><div className="skeleton skeleton-text"></div></td>
                <td><div className="skeleton skeleton-badge"></div></td>
                <td><div className="skeleton skeleton-text"></div></td>
                <td><div className="skeleton skeleton-text"></div></td>
                <td><div className="skeleton skeleton-text"></div></td>
                {userRole === 'admin' && <td><div className="skeleton skeleton-btn text-right"></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (leads.length === 0) {
    return null; // EmptyState will handle rendering outside the table
  }

  return (
    <div className="table-responsive">
      <table className="leads-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Source</th>
            <th>Created At</th>
            <th>Owner</th>
            {userRole === 'admin' && <th className="text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const creatorName =
              typeof lead.createdBy === 'object' && lead.createdBy
                ? lead.createdBy.name
                : 'Unknown';

            return (
              <tr key={lead._id} onClick={() => onRowClick(lead._id)} className="clickable-row">
                <td className="font-medium text-white">{lead.name}</td>
                <td>{lead.email}</td>
                <td>
                  <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                </td>
                <td>{getSourceEmoji(lead.source)}</td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td>{creatorName}</td>
                {userRole === 'admin' && (
                  <td className="text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="table-action-btn delete-btn"
                      onClick={(e) => onDeleteClick?.(lead._id, e)}
                      title="Delete Lead"
                    >
                      🗑️
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
