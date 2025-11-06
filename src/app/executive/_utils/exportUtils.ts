import { format } from 'date-fns'
import type { ExportData } from '../_types/analytics.types'

// Generic type for CSV export data
type CSVData = Record<string, string | number | boolean | null | undefined>

// Export to CSV
export const exportToCSV = (data: CSVData[], filename: string): void => {
	if (data.length === 0) {
		alert('No data to export')
		return
	}

	// Get headers from first object
	const headers = Object.keys(data[0])
	const csvHeaders = headers.join(',')

	// Convert data to CSV rows
	const csvRows = data.map((row) => {
		return headers
			.map((header) => {
				const value = row[header]
				// Handle values that might contain commas
				if (typeof value === 'string' && value.includes(',')) {
					return `"${value}"`
				}
				return value
			})
			.join(',')
	})

	const csvContent = [csvHeaders, ...csvRows].join('\n')

	// Create and download file
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
	const link = document.createElement('a')
	const url = URL.createObjectURL(blob)
	link.setAttribute('href', url)
	link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.csv`)
	link.style.visibility = 'hidden'
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

// Export to JSON
export const exportToJSON = (data: unknown, filename: string): void => {
	const jsonContent = JSON.stringify(data, null, 2)
	const blob = new Blob([jsonContent], { type: 'application/json' })
	const link = document.createElement('a')
	const url = URL.createObjectURL(blob)
	link.setAttribute('href', url)
	link.setAttribute('download', `${filename}_${format(new Date(), 'yyyy-MM-dd')}.json`)
	link.style.visibility = 'hidden'
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

// Prepare Report Data for Export
export const prepareReportData = (
	reportName: string,
	dateRange: { start: Date; end: Date },
	data: unknown
): ExportData => {
	return {
		reportName,
		generatedAt: new Date(),
		dateRange,
		data,
	}
}

// Format number for export
export const formatNumber = (num: number, decimals: number = 2): string => {
	return num.toFixed(decimals)
}

// Format percentage for export
export const formatPercentage = (num: number, decimals: number = 1): string => {
	return `${num.toFixed(decimals)}%`
}

// Format date for export
export const formatDateForExport = (date: Date): string => {
	return format(date, 'yyyy-MM-dd HH:mm:ss')
}

// Print-friendly HTML report (for PDF generation via browser print)
export const generatePrintableReport = (
	title: string,
	dateRange: { start: Date; end: Date },
	sections: Array<{ title: string; content: string }>
): void => {
	const printWindow = window.open('', '_blank')
	if (!printWindow) {
		alert('Please allow popups to generate PDF')
		return
	}

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>${title}</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			max-width: 800px;
			margin: 40px auto;
			padding: 20px;
			color: #333;
		}
		h1 {
			color: #2563eb;
			border-bottom: 2px solid #2563eb;
			padding-bottom: 10px;
		}
		.meta {
			color: #666;
			margin: 20px 0;
			font-size: 14px;
		}
		.section {
			margin: 30px 0;
			page-break-inside: avoid;
		}
		.section h2 {
			color: #1e40af;
			margin-bottom: 15px;
		}
		.section-content {
			background: #f9fafb;
			padding: 15px;
			border-radius: 8px;
			border-left: 4px solid #2563eb;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			margin: 15px 0;
		}
		th, td {
			text-align: left;
			padding: 12px;
			border-bottom: 1px solid #e5e7eb;
		}
		th {
			background: #f3f4f6;
			font-weight: 600;
		}
		@media print {
			body {
				margin: 0;
			}
			.no-print {
				display: none;
			}
		}
	</style>
</head>
<body>
	<h1>${title}</h1>
	<div class="meta">
		<strong>Generated:</strong> ${format(new Date(), 'PPP p')}<br>
		<strong>Period:</strong> ${format(dateRange.start, 'PPP')} - ${format(dateRange.end, 'PPP')}
	</div>
	${sections.map(section => `
		<div class="section">
			<h2>${section.title}</h2>
			<div class="section-content">
				${section.content}
			</div>
		</div>
	`).join('')}
	<div class="no-print" style="margin-top: 40px; text-align: center;">
		<button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer;">
			Print / Save as PDF
		</button>
		<button onclick="window.close()" style="padding: 12px 24px; background: #6b7280; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; margin-left: 10px;">
			Close
		</button>
	</div>
</body>
</html>
	`

	printWindow.document.write(html)
	printWindow.document.close()
}

