import type { ILead } from '../types/index';

const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const exportToCSV = (leads: ILead[], filename: string): void => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];

  const rows = leads.map((lead) => {
    const dateStr = new Date(lead.createdAt).toISOString().split('T')[0];
    return [
      escapeCSV(lead.name),
      escapeCSV(lead.email),
      escapeCSV(lead.status),
      escapeCSV(lead.source),
      escapeCSV(dateStr),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
