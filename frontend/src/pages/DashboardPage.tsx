import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats } from '../api/leads.api';
import type { DashboardStats, ILead } from '../types/index';
import { Spinner } from '../components/ui/Spinner';
import { Badge } from '../components/ui/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError(response.message || 'Failed to fetch dashboard metrics');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

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

  if (isLoading) {
    return (
      <div className="dashboard-loading-container">
        <Spinner size="lg" />
        <p className="dashboard-loading-text">Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="dashboard-error-container">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Failed to load statistics</h3>
        <p className="error-description">{error || 'Unknown error occurred'}</p>
      </div>
    );
  }

  // Formatting data for Recharts BarChart
  const chartData = Object.entries(stats.bySource).map(([key, value]) => ({
    name: key,
    leadsCount: value,
  }));

  const chartColors = ['#3b82f6', '#ec4899', '#10b981'];

  return (
    <div className="dashboard-view-container">
      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card bg-gradient-total">
          <div className="metric-card-content">
            <span className="metric-card-label">Total Leads Acquisition</span>
            <h2 className="metric-card-value">{stats.total}</h2>
          </div>
          <span className="metric-card-icon">💼</span>
        </div>

        <div className="metric-card border-left-new">
          <div className="metric-card-content">
            <span className="metric-card-label">New Opportunities</span>
            <h2 className="metric-card-value">{stats.byStatus.New || 0}</h2>
          </div>
          <span className="metric-card-icon text-blue">📩</span>
        </div>

        <div className="metric-card border-left-qualified">
          <div className="metric-card-content">
            <span className="metric-card-label">Qualified Leads</span>
            <h2 className="metric-card-value">{stats.byStatus.Qualified || 0}</h2>
          </div>
          <span className="metric-card-icon text-green">🎯</span>
        </div>

        <div className="metric-card border-left-lost">
          <div className="metric-card-content">
            <span className="metric-card-label">Lost Leads</span>
            <h2 className="metric-card-value">{stats.byStatus.Lost || 0}</h2>
          </div>
          <span className="metric-card-icon text-red">❌</span>
        </div>
      </div>

      {/* Analytics & Recent Pipeline */}
      <div className="dashboard-details-grid">
        {/* Source Distribution Chart */}
        <div className="dashboard-card chart-card">
          <h3 className="dashboard-card-title">Leads Source Distribution</h3>
          <div className="chart-wrapper">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="leadsCount" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">No lead sources logged yet.</div>
            )}
          </div>
        </div>

        {/* Recent Pipeline Table */}
        <div className="dashboard-card recent-leads-card">
          <h3 className="dashboard-card-title">Recent Pipeline Additions</h3>
          <div className="recent-leads-list">
            {stats.recentLeads && stats.recentLeads.length > 0 ? (
              <div className="table-responsive">
                <table className="dashboard-recent-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentLeads.map((lead: ILead) => (
                      <tr
                        key={lead._id}
                        className="recent-lead-row"
                        onClick={() => navigate(`/leads/${lead._id}`)}
                      >
                        <td className="recent-lead-name">
                          <div className="name-text">{lead.name}</div>
                          <div className="email-text">{lead.email}</div>
                        </td>
                        <td>
                          <Badge variant={getStatusVariant(lead.status)}>{lead.status}</Badge>
                        </td>
                        <td className="recent-lead-source">
                          {lead.source === 'Website' && '🌐'}
                          {lead.source === 'Instagram' && '📸'}
                          {lead.source === 'Referral' && '🤝'} {lead.source}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-recent-leads">No leads in pipeline.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
