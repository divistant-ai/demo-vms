import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'

type ComplianceReport = {
  id: string
  name: string
  standard: string
  description: string
  industries: string[]
  lastGenerated: string
  status: 'compliant' | 'warning' | 'non-compliant'
  score: number
}

const reports: ComplianceReport[] = [
  { id: 'gdpr', name: 'GDPR Compliance', standard: 'GDPR', description: 'Data privacy and protection', industries: ['all'], lastGenerated: '2025-10-28', status: 'compliant', score: 98 },
  { id: 'iso9001', name: 'ISO 9001', standard: 'ISO 9001', description: 'Quality management systems', industries: ['manufacturing'], lastGenerated: '2025-10-25', status: 'compliant', score: 95 },
  { id: 'iso28000', name: 'ISO 28000', standard: 'ISO 28000', description: 'Supply chain security', industries: ['logistics'], lastGenerated: '2025-10-20', status: 'warning', score: 87 },
  { id: 'osha', name: 'OSHA Safety', standard: 'OSHA', description: 'Workplace safety compliance', industries: ['manufacturing', 'logistics'], lastGenerated: '2025-10-15', status: 'compliant', score: 92 },
]

export function ComplianceReportsPage() {
  const handleGenerate = (id: string) => {
    alert(`Generating ${reports.find(r => r.id === id)?.name} report...`)
  }

  const handleDownload = (id: string) => {
    alert(`Downloading ${reports.find(r => r.id === id)?.name} report PDF...`)
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading>Compliance Reports</Heading>
        <Text className="mt-2">Auto-generate compliance documentation for your industry</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map(report => (
          <div key={report.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Heading level={3} className="mb-2">{report.name}</Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">{report.description}</Text>
              </div>
              <Badge color={report.status === 'compliant' ? 'green' : report.status === 'warning' ? 'amber' : 'red'}>
                {report.score}%
              </Badge>
            </div>

            <div className="mb-4">
              <Text className="text-sm text-gray-500">Last generated: {report.lastGenerated}</Text>
            </div>

            <div className="flex gap-2">
              <Button color="blue" onClick={() => handleGenerate(report.id)}>Generate</Button>
              <Button color="zinc" onClick={() => handleDownload(report.id)}>Download PDF</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

