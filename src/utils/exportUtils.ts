import type { Incident } from '../types/incident'
import type { Alert } from '../types/alert'

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: Array<T>,
  filename: string,
  headers?: Record<string, string>
) {
  if (data.length === 0) {
    alert('No data to export')
    return
  }

  // Get all unique keys from data
  const keys = Object.keys(data[0])
  
  // Create header row
  const headerRow = keys.map(key => headers?.[key] || key).join(',')
  
  // Create data rows
  const rows = data.map(item => {
    return keys.map(key => {
      const value = item[key]
      // Handle different data types
      if (value === null || value === undefined) return ''
      if (value instanceof Date) return value.toISOString()
      if (typeof value === 'object') return JSON.stringify(value)
      // Escape commas and quotes in strings
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  })
  
  // Combine header and rows
  const csvContent = [headerRow, ...rows].join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export incidents to CSV
 */
export function exportIncidentsToCSV(incidents: Array<Incident>) {
  exportToCSV(incidents, `incidents-${new Date().toISOString().split('T')[0]}`, {
    id: 'Incident ID',
    type: 'Type',
    severity: 'Severity',
    timestamp: 'Timestamp',
    location: 'Location',
    cameraId: 'Camera ID',
    description: 'Description',
    status: 'Status',
  })
}

/**
 * Export alerts to CSV
 */
export function exportAlertsToCSV(alerts: Array<Alert>) {
  exportToCSV(alerts, `alerts-${new Date().toISOString().split('T')[0]}`, {
    id: 'Alert ID',
    type: 'Type',
    severity: 'Severity',
    timestamp: 'Timestamp',
    message: 'Message',
    cameraId: 'Camera ID',
    acknowledged: 'Acknowledged',
  })
}

/**
 * Generate PDF report (mock implementation)
 * In production, use a library like jsPDF or pdfmake
 */
export function exportToPDF(
  title: string,
  content: string,
  _filename: string
) {
  // Mock PDF generation - in production use jsPDF or similar
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Please allow popups to generate PDF')
    return
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          h1 {
            color: #0066cc;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div>${content}</div>
        <div class="footer">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

/**
 * Generate analytics report PDF
 */
export function exportAnalyticsReport(
  title: string,
  data: {
    summary: Record<string, any>
    charts?: Array<{ title: string; description: string }>
  }
) {
  const summaryHtml = Object.entries(data.summary)
    .map(([key, value]) => `<tr><td><strong>${key}</strong></td><td>${value}</td></tr>`)
    .join('')
  
  const chartsHtml = data.charts
    ? `<h2>Charts</h2>
       <ul>
         ${data.charts.map(chart => `<li>${chart.title}: ${chart.description}</li>`).join('')}
       </ul>`
    : ''
  
  const content = `
    <h2>Summary</h2>
    <table>
      ${summaryHtml}
    </table>
    ${chartsHtml}
  `
  
  exportToPDF(title, content, `analytics-report-${new Date().toISOString().split('T')[0]}`)
}
