import { useState, useEffect } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Badge } from '../components/catalyst/badge'
import { getIndustryProfile } from '../data/industryProfiles'
import type { IndustryType } from '../types/industry'

type Benchmark = {
  metric: string
  yourValue: number
  industryAvg: number
  topPerformer: number
  unit: string
  status: 'above' | 'average' | 'below'
}

const benchmarkData: Record<string, Benchmark[]> = {
  retail: [
    { metric: 'Conversion Rate', yourValue: 22, industryAvg: 20, topPerformer: 35, unit: '%', status: 'above' },
    { metric: 'Avg Dwell Time', yourValue: 12, industryAvg: 15, topPerformer: 25, unit: 'min', status: 'below' },
    { metric: 'Theft Prevention', yourValue: 98, industryAvg: 92, topPerformer: 99, unit: '%', status: 'above' },
  ],
  logistics: [
    { metric: 'Vehicle Throughput', yourValue: 85, industryAvg: 75, topPerformer: 95, unit: '/day', status: 'above' },
    { metric: 'Safety Score', yourValue: 92, industryAvg: 88, topPerformer: 98, unit: '%', status: 'above' },
    { metric: 'Dock Utilization', yourValue: 78, industryAvg: 80, topPerformer: 92, unit: '%', status: 'average' },
  ],
  manufacturing: [
    { metric: 'OEE', yourValue: 85, industryAvg: 85, topPerformer: 95, unit: '%', status: 'average' },
    { metric: 'Defect Rate', yourValue: 1.2, industryAvg: 2.5, topPerformer: 0.5, unit: '%', status: 'above' },
    { metric: 'Safety Incidents', yourValue: 0, industryAvg: 2, topPerformer: 0, unit: '/month', status: 'above' },
  ],
}

export function IndustryBenchmarksPage() {
  const [industry, setIndustry] = useState<IndustryType | null>(null)
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('industryProfile') as IndustryType
    if (saved) {
      setIndustry(saved)
      setBenchmarks(benchmarkData[saved] || [])
    }
  }, [])

  const profile = industry ? getIndustryProfile(industry) : null

  return (
    <div className="space-y-8">
      <div>
        <Heading>Industry Benchmarks</Heading>
        <Text className="mt-2">Compare your performance with industry standards</Text>
      </div>

      {profile && (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{profile.icon}</span>
            <Heading level={2}>{profile.name}</Heading>
          </div>
          <Text className="opacity-90">Industry benchmark comparison</Text>
        </div>
      )}

      <div className="space-y-4">
        {benchmarks.map((benchmark, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Heading level={3}>{benchmark.metric}</Heading>
                <Badge color={benchmark.status === 'above' ? 'green' : benchmark.status === 'average' ? 'amber' : 'red'}>
                  {benchmark.status === 'above' ? 'Above Average' : benchmark.status === 'average' ? 'Average' : 'Below Average'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Text className="text-sm text-gray-500 mb-1">Your Value</Text>
                <Heading level={2}>{benchmark.yourValue}{benchmark.unit}</Heading>
              </div>
              <div>
                <Text className="text-sm text-gray-500 mb-1">Industry Average</Text>
                <Heading level={2}>{benchmark.industryAvg}{benchmark.unit}</Heading>
              </div>
              <div>
                <Text className="text-sm text-gray-500 mb-1">Top Performer</Text>
                <Heading level={2}>{benchmark.topPerformer}{benchmark.unit}</Heading>
              </div>
            </div>

            <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-blue-600"
                style={{ width: `${(benchmark.yourValue / benchmark.topPerformer) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

