import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../hooks/useLeads';
import { useAuth } from '../hooks/useAuth';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadTable } from '../components/leads/LeadTable';
import { LeadForm } from '../components/leads/LeadForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/ui/Pagination';
import { exportLeadsCSV } from '../api/leads.api';

export const LeadsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const {
    leads,
    filters,
    meta,
    isLoading,
    updateFilters,
    clearFilters,
    createLead,
    deleteLead,
  } = useLeads();

  const handleRowClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  const handleDeleteClick = async (leadId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you absolutely sure you want to permanently delete this lead?')) {
      try {
        await deleteLead(leadId);
      } catch (err: any) {
        alert(err.message || 'Failed to delete lead');
      }
    }
  };

  const handleAddLeadSubmit = async (data: any) => {
    try {
      await createLead(data);
      setIsAddModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create new lead');
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const csvData = await exportLeadsCSV({
        status: filters.status || undefined,
        source: filters.source || undefined,
        search: filters.search || undefined,
      });

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Failed to export CSV file');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="leads-page-container">
      {/* Title & Actions Row */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title text-white">Leads Funnel</h2>
          <p className="page-subtitle text-slate">Add, classify, filter, and track sales pipeline leads</p>
        </div>
        <div className="page-actions-group">
          {user?.role === 'admin' && (
            <Button
              variant="secondary"
              onClick={handleExportCSV}
              isLoading={exporting}
              className="export-btn"
            >
              📥 Export CSV
            </Button>
          )}
          <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
            ➕ Create New Lead
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <LeadFilters
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {/* Pipeline Leads List */}
      <div className="leads-list-container card-panel">
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          userRole={user?.role}
          onRowClick={handleRowClick}
          onDeleteClick={handleDeleteClick}
        />

        {!isLoading && leads.length === 0 && (
          <EmptyState onClearFilters={clearFilters} />
        )}

        {meta && !isLoading && leads.length > 0 && (
          <Pagination
            meta={meta}
            onPageChange={(page) => updateFilters({ page })}
          />
        )}
      </div>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead to Funnel"
      >
        <LeadForm
          onSubmit={handleAddLeadSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
export default LeadsPage;
