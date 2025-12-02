import React from 'react';
import { HotelData } from '../types';

interface ExportButtonProps {
  data: HotelData[];
  filename?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename = 'hotel-data.csv' }) => {
  const handleExport = () => {
    if (data.length === 0) return;

    // Define headers
    const headers = [
      "Name",
      "Owner Email",
      "Company Email",
      "Phone",
      "Website",
      "Website Quality",
      "Has Chatbot",
      "Chatbot Quality",
      "Rating",
      "Comments"
    ];

    // Convert data to CSV format
    const csvContent = [
      headers.join(','),
      ...data.map(row => {
        return [
          `"${row.name.replace(/"/g, '""')}"`,
          `"${row.ownerEmail.replace(/"/g, '""')}"`,
          `"${row.companyEmail.replace(/"/g, '""')}"`,
          `"${row.phone.replace(/"/g, '""')}"`,
          `"${row.website.replace(/"/g, '""')}"`,
          `"${row.websiteQuality.replace(/"/g, '""')}"`,
          `"${row.hasChatbot.replace(/"/g, '""')}"`,
          `"${row.chatbotQuality.replace(/"/g, '""')}"`,
          `"${row.rating.replace(/"/g, '""')}"`,
          `"${row.comments.replace(/"/g, '""')}"`
        ].join(',');
      })
    ].join('\n');

    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Export to CSV
    </button>
  );
};

export default ExportButton;