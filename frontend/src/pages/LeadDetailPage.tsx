import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLeadById, updateLead, deleteLead } from '../api/leads.api';
import type { ILead } from '../types/index';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { LeadForm } from '../components/leads/LeadForm';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [lead, setLead] = useState<ILead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    const fetchLeadDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await getLeadById(id);
        if (response.success && response.data) {
          setLead(response.data);
        } else {
          setError(response.message || 'Failed to fetch lead details');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lead details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeadDetails();
  }, [id]);

  const handleEditSubmit = async (data: any) => {
    if (!id) return;
    try {
      const response = await updateLead(id, data);
      if (response.success && response.data) {
        setLead(response.data);
        setIsEditMode(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update lead');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you absolutely sure you want to permanently delete this lead?')) {
      try {
        const response = await deleteLead(id);
        if (response.success) {
          navigate('/leads');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete lead');
      }
    }
  };

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
      <div className="lead-detail-loading">
        <Spinner size="lg" />
        <p className="loading-text text-slate">Fetching pipeline lead details...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="lead-detail-error">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Lead Not Found</h3>
        <p className="error-description">{error || 'The requested lead does not exist or has been deleted.'}</p>
        <Button variant="secondary" onClick={() => navigate('/leads')}>
          Back to Pipeline
        </Button>
      </div>
    );
  }

  const creatorName = typeof lead.createdBy === 'object' && lead.createdBy ? lead.createdBy.name : 'Unknown';
  const creatorEmail = typeof lead.createdBy === 'object' && lead.createdBy ? lead.createdBy.email : '';

  return (
    <div className="lead-detail-container">
      {/* Back Navigation Bar */}
      <div className="detail-navigation-bar">
        <button onClick={() => navigate('/leads')} className="back-link-btn">
          ⬅️ Back to Pipeline
        </button>
      </div>

      <div className="detail-grid">
        {/* Main Details Panel */}
        <div className="detail-main-panel card-panel">
          {isEditMode ? (
            <div className="edit-lead-section">
              <h3 className="section-title text-white">Edit Lead Profile</h3>
              <LeadForm
                initialValues={lead}
                onSubmit={handleEditSubmit}
                onCancel={() => setIsEditMode(false)}
                buttonText="Update Lead Details"
              />
            </div>
          ) : (
            <div className="view-lead-section">
              <div className="detail-header-block">
                <div className="title-area">
                  <h1 className="lead-name text-white">{lead.name}</h1>
                  <span className="lead-email text-slate">{lead.email}</span>
                </div>
                <div className="badge-area">
                  <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                </div>
              </div>

              <hr className="divider" />

              <div className="lead-attributes-grid">
                <div className="attribute-item">
                  <div className="attr-label">Acquisition Channel</div>
                  <div className="attr-value text-white">{getSourceEmoji(lead.source)}</div>
                </div>

                <div className="attribute-item">
                  <div className="attr-label">Owner Rep</div>
                  <div className="attr-value text-white">
                    {creatorName} {creatorEmail && `(${creatorEmail})`}
                  </div>
                </div>

                <div className="attribute-item">
                  <div className="attr-label">Logged Date</div>
                  <div className="attr-value text-white">
                    {new Date(lead.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>

                <div className="attribute-item">
                  <div className="attr-label">Last Modified</div>
                  <div className="attr-value text-white">
                    {new Date(lead.updatedAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </div>
              </div>

              {lead.notes ? (
                <div className="lead-notes-block">
                  <h4 className="notes-heading text-white">Requirement Details & Notes</h4>
                  <p className="notes-text text-slate">{lead.notes}</p>
                </div>
              ) : (
                <div className="lead-notes-block empty-notes">
                  <h4 className="notes-heading text-slate">No requirements noted.</h4>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rep Actions Side Panel */}
        <div className="detail-side-panel card-panel">
          <h3 className="side-panel-title text-white">Funnel Operations</h3>
          <p className="side-panel-desc text-slate">Perform modifications or permanent removals on this lead profile.</p>

          <div className="side-actions-list">
            {!isEditMode && (
              <Button
                variant="primary"
                onClick={() => setIsEditMode(true)}
                className="w-full justify-center"
              >
                ✏️ Edit Details
              </Button>
            )}
            
            {user?.role === 'admin' && (
              <Button
                variant="danger"
                onClick={handleDelete}
                className="w-full justify-center mt-2"
              >
                🗑️ Delete Lead
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeadDetailPage;
