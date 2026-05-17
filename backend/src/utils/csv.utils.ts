import { ILeadDocument } from '../models/Lead.model';

const escapeCSV = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const generateCSV = (leads: ILeadDocument[]): string => {
  const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];

  const rows = leads.map((lead) => {
    const createdAt = new Date(lead.createdAt).toISOString().split('T')[0];
    return [
      escapeCSV(lead.name),
      escapeCSV(lead.email),
      escapeCSV(lead.status),
      escapeCSV(lead.source),
      escapeCSV(lead.notes ?? ''),
      escapeCSV(createdAt),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};
