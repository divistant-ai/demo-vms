import { useState } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'
import { Select } from '../components/catalyst/select'
import { Input } from '../components/catalyst/input'

type ComplianceReport = {
  id: string
  name: string
  standard: string
  description: string
  industries: string[]
  lastGenerated: Date
  status: 'compliant' | 'warning' | 'non-compliant'
  score: number
  requirements: number
  passed: number
  warnings: number
  failed: number
  nextReview: Date
  frequency: 'monthly' | 'quarterly' | 'annually'
  category: 'privacy' | 'security' | 'safety' | 'quality' | 'environmental'
}

const mockReports: ComplianceReport[] = [
  { 
    id: 'gdpr', 
    name: 'GDPR Compliance', 
    standard: 'GDPR', 
    description: 'General Data Protection Regulation - Data privacy and protection for EU citizens', 
    industries: ['all'], 
    lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
    status: 'compliant', 
    score: 98,
    requirements: 50,
    passed: 49,
    warnings: 1,
    failed: 0,
    nextReview: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    frequency: 'monthly',
    category: 'privacy'
  },
  { 
    id: 'iso9001', 
    name: 'ISO 9001:2015', 
    standard: 'ISO 9001', 
    description: 'Quality management systems - Requirements for consistent quality delivery', 
    industries: ['manufacturing', 'logistics'], 
    lastGenerated: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), 
    status: 'compliant', 
    score: 95,
    requirements: 85,
    passed: 81,
    warnings: 4,
    failed: 0,
    nextReview: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000),
    frequency: 'quarterly',
    category: 'quality'
  },
  { 
    id: 'iso28000', 
    name: 'ISO 28000:2007', 
    standard: 'ISO 28000', 
    description: 'Supply chain security management - Security management systems for the supply chain', 
    industries: ['logistics', 'port'], 
    lastGenerated: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), 
    status: 'warning', 
    score: 87,
    requirements: 65,
    passed: 57,
    warnings: 6,
    failed: 2,
    nextReview: new Date(Date.now() + 79 * 24 * 60 * 60 * 1000),
    frequency: 'quarterly',
    category: 'security'
  },
  { 
    id: 'osha', 
    name: 'OSHA Safety Standards', 
    standard: 'OSHA', 
    description: 'Occupational Safety and Health Administration - Workplace safety compliance', 
    industries: ['manufacturing', 'logistics', 'port'], 
    lastGenerated: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), 
    status: 'compliant', 
    score: 92,
    requirements: 120,
    passed: 111,
    warnings: 9,
    failed: 0,
    nextReview: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    frequency: 'monthly',
    category: 'safety'
  },
  { 
    id: 'iso27001', 
    name: 'ISO 27001:2013', 
    standard: 'ISO 27001', 
    description: 'Information security management - Requirements for information security management systems', 
    industries: ['all'], 
    lastGenerated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), 
    status: 'compliant', 
    score: 94,
    requirements: 114,
    passed: 107,
    warnings: 7,
    failed: 0,
    nextReview: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
    frequency: 'quarterly',
    category: 'security'
  },
  { 
    id: 'iso14001', 
    name: 'ISO 14001:2015', 
    standard: 'ISO 14001', 
    description: 'Environmental management systems - Requirements with guidance for use', 
    industries: ['manufacturing', 'port'], 
    lastGenerated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), 
    status: 'warning', 
    score: 83,
    requirements: 72,
    passed: 60,
    warnings: 9,
    failed: 3,
    nextReview: new Date(Date.now() + 315 * 24 * 60 * 60 * 1000),
    frequency: 'annually',
    category: 'environmental'
  },
  { 
    id: 'hipaa', 
    name: 'HIPAA Compliance', 
    standard: 'HIPAA', 
    description: 'Health Insurance Portability and Accountability Act - Healthcare data privacy', 
    industries: ['healthcare'], 
    lastGenerated: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), 
    status: 'compliant', 
    score: 96,
    requirements: 45,
    passed: 43,
    warnings: 2,
    failed: 0,
    nextReview: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    frequency: 'monthly',
    category: 'privacy'
  },
  { 
    id: 'pci-dss', 
    name: 'PCI DSS v4.0', 
    standard: 'PCI DSS', 
    description: 'Payment Card Industry Data Security Standard - Secure payment processing', 
    industries: ['retail', 'all'], 
    lastGenerated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), 
    status: 'compliant', 
    score: 91,
    requirements: 78,
    passed: 71,
    warnings: 7,
    failed: 0,
    nextReview: new Date(Date.now() + 65 * 24 * 60 * 60 * 1000),
    frequency: 'quarterly',
    category: 'security'
  },
]

// Custom SVG Icons
function DocumentIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M4 4h12v12H4V4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 8h6M7 12h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7 10l2 2 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExclamationIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 6v4m0 4h.01M4 18h12a2 2 0 0 0 1.732-3L11.732 4a2 2 0 0 0-3.464 0L2.268 15A2 2 0 0 0 4 18Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ComplianceReportsPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleGenerate = (id: string) => {
    const report = mockReports.find(r => r.id === id)
    alert(`Generating ${report?.name} report...\nThis will take approximately 2-3 minutes.`)
  }

  const handleDownload = (id: string) => {
    const report = mockReports.find(r => r.id === id)
    alert(`Downloading ${report?.name} report PDF...`)
  }

  const filteredReports = mockReports.filter(report => {
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus
    const matchesSearch = searchQuery === '' || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.standard.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string): 'green' | 'yellow' | 'red' | 'zinc' => {
    switch (status) {
      case 'compliant': return 'green'
      case 'warning': return 'yellow'
      case 'non-compliant': return 'red'
      default: return 'zinc'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case 'warning':
        return <ExclamationIcon className="w-5 h-5 text-yellow-600" />
      case 'non-compliant':
        return <ExclamationIcon className="w-5 h-5 text-red-600" />
      default:
        return <DocumentIcon className="w-5 h-5 text-zinc-600" />
    }
  }

  const totalReports = mockReports.length
  const compliantCount = mockReports.filter(r => r.status === 'compliant').length
  const warningCount = mockReports.filter(r => r.status === 'warning').length
  const avgScore = Math.round(mockReports.reduce((sum, r) => sum + r.score, 0) / mockReports.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading>Compliance Reports</Heading>
        <Text className="mt-2">Auto-generate compliance documentation for your industry standards</Text>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Total Reports</Text>
              <Heading className="text-2xl mt-1">{totalReports}</Heading>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <DocumentIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Compliant</Text>
              <Heading className="text-2xl mt-1 text-green-600">{compliantCount}</Heading>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Warnings</Text>
              <Heading className="text-2xl mt-1 text-yellow-600">{warningCount}</Heading>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <ExclamationIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Avg. Score</Text>
              <Heading className="text-2xl mt-1">{avgScore}%</Heading>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600 font-bold text-lg">
              {avgScore}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="privacy">Privacy</option>
              <option value="security">Security</option>
              <option value="safety">Safety</option>
              <option value="quality">Quality</option>
              <option value="environmental">Environmental</option>
            </Select>
          </div>
          <div>
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="compliant">Compliant</option>
              <option value="warning">Warning</option>
              <option value="non-compliant">Non-Compliant</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(report.status)}
                  <Subheading>{report.name}</Subheading>
                </div>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">{report.description}</Text>
              </div>
              <Badge color={getStatusColor(report.status)}>
                {report.score}%
              </Badge>
            </div>

            {/* Requirements Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <div>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">Passed</Text>
                <Text className="text-lg font-semibold text-green-600">{report.passed}</Text>
              </div>
              <div>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">Warnings</Text>
                <Text className="text-lg font-semibold text-yellow-600">{report.warnings}</Text>
              </div>
              <div>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">Failed</Text>
                <Text className="text-lg font-semibold text-red-600">{report.failed}</Text>
              </div>
            </div>

            {/* Meta Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <Text className="text-zinc-500 dark:text-zinc-400">Category:</Text>
                <Badge color="zinc">{report.category}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Text className="text-zinc-500 dark:text-zinc-400">Frequency:</Text>
                <Text className="font-medium">{report.frequency}</Text>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Text className="text-zinc-500 dark:text-zinc-400">Last Generated:</Text>
                <Text className="font-medium">{report.lastGenerated.toLocaleDateString()}</Text>
              </div>
              <div className="flex items-center justify-between text-sm">
                <Text className="text-zinc-500 dark:text-zinc-400">Next Review:</Text>
                <Text className="font-medium">{report.nextReview.toLocaleDateString()}</Text>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button color="blue" onClick={() => handleGenerate(report.id)} className="flex-1">
                Generate Report
              </Button>
              <Button color="zinc" onClick={() => handleDownload(report.id)}>
                Download PDF
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <DocumentIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <Heading className="text-xl mb-2">No reports found</Heading>
          <Text className="text-zinc-500 dark:text-zinc-400">
            Try adjusting your search or filter criteria
          </Text>
        </div>
      )}
    </div>
  )
}

