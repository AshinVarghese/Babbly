/**
 * exportService.js
 * Generates lightweight CSVs and structured text summaries for pediatric visits.
 * (For a true PDF, we would add jspdf here in the future).
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportService = {
    generateCSV(events) {
        if (!events || events.length === 0) return null;

        const headers = ['Type', 'Start Time', 'End Time', 'Details', 'Created By', 'Created At'];

        // Convert to CSV rows
        const rows = events.map(e => {
            const start = new Date(e.startTime).toLocaleString();
            const end = e.endTime ? new Date(e.endTime).toLocaleString() : '';
            const details = JSON.stringify(e.metadata).replace(/"/g, '""'); // Escaped JSON string for CSV cell

            return [
                e.type,
                `"${start}"`,
                `"${end}"`,
                `"${details}"`,
                e.createdBy,
                `"${new Date(e.createdAt).toLocaleString()}"`
            ].join(',');
        });

        return [headers.join(','), ...rows].join('\n');
    },

    downloadCSV(events, fileName = 'babbly_export.csv') {
        const csvContent = this.generateCSV(events);
        if (!csvContent) return;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    downloadPDF(events, profile, fileName = 'babbly_summary.pdf') {
        if (!events || events.length === 0) return;

        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text(`Babbly Summary: ${profile.name || 'Baby'}`, 14, 22);

        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableData = events.map(e => [
            e.type.toUpperCase(),
            new Date(e.startTime).toLocaleString(),
            JSON.stringify(e.metadata)
        ]);

        doc.autoTable({
            startY: 40,
            head: [['Activity', 'Time', 'Details']],
            body: tableData,
        });

        doc.save(fileName);
    }
};
