import { useState, useEffect } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Select } from '../components/catalyst/select'
import { getIndustryProfile } from '../data/industryProfiles'
import type { IndustryType } from '../types/industry'

// Custom SVG Icons
function TrendingUpIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  )
}

function TrendingDownIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
    </svg>
  )
}

function ChartBarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function TrophyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  )
}

type Benchmark = {
  metric: string
  yourValue: number
  industryAvg: number
  topPerformer: number
  unit: string
  status: 'above' | 'average' | 'below'
  category: string
  trend: 'up' | 'down' | 'stable'
  change: number
}

const benchmarkData: Record<string, Benchmark[]> = {
  'smart-city': [
    { metric: 'Response Time', yourValue: 3.2, industryAvg: 5.5, topPerformer: 2.1, unit: 'min', status: 'above', category: 'Operations', trend: 'down', change: -12 },
    { metric: 'Incident Detection Rate', yourValue: 94, industryAvg: 85, topPerformer: 98, unit: '%', status: 'above', category: 'AI Performance', trend: 'up', change: 8 },
    { metric: 'False Positive Rate', yourValue: 3.5, industryAvg: 8.2, topPerformer: 1.8, unit: '%', status: 'above', category: 'AI Performance', trend: 'down', change: -15 },
    { metric: 'System Uptime', yourValue: 99.8, industryAvg: 99.2, topPerformer: 99.9, unit: '%', status: 'above', category: 'Reliability', trend: 'stable', change: 0 },
    { metric: 'Camera Coverage', yourValue: 87, industryAvg: 75, topPerformer: 95, unit: '%', status: 'above', category: 'Infrastructure', trend: 'up', change: 5 },
    { metric: 'Data Processing Speed', yourValue: 120, industryAvg: 95, topPerformer: 150, unit: 'fps', status: 'above', category: 'Performance', trend: 'up', change: 12 },
  ],
  retail: [
    { metric: 'Conversion Rate', yourValue: 22, industryAvg: 20, topPerformer: 35, unit: '%', status: 'above', category: 'Sales', trend: 'up', change: 10 },
    { metric: 'Avg Dwell Time', yourValue: 12, industryAvg: 15, topPerformer: 25, unit: 'min', status: 'below', category: 'Customer Behavior', trend: 'down', change: -8 },
    { metric: 'Theft Prevention', yourValue: 98, industryAvg: 92, topPerformer: 99, unit: '%', status: 'above', category: 'Security', trend: 'stable', change: 2 },
    { metric: 'Queue Wait Time', yourValue: 2.5, industryAvg: 4.2, topPerformer: 1.8, unit: 'min', status: 'above', category: 'Operations', trend: 'down', change: -18 },
    { metric: 'Footfall Accuracy', yourValue: 96, industryAvg: 88, topPerformer: 99, unit: '%', status: 'above', category: 'Analytics', trend: 'up', change: 6 },
  ],
  logistics: [
    { metric: 'Vehicle Throughput', yourValue: 85, industryAvg: 75, topPerformer: 95, unit: '/day', status: 'above', category: 'Operations', trend: 'up', change: 13 },
    { metric: 'Safety Score', yourValue: 92, industryAvg: 88, topPerformer: 98, unit: '%', status: 'above', category: 'Safety', trend: 'up', change: 5 },
    { metric: 'Dock Utilization', yourValue: 78, industryAvg: 80, topPerformer: 92, unit: '%', status: 'average', category: 'Efficiency', trend: 'stable', change: 1 },
    { metric: 'Loading Time', yourValue: 18, industryAvg: 25, topPerformer: 15, unit: 'min', status: 'above', category: 'Operations', trend: 'down', change: -12 },
    { metric: 'Incident Rate', yourValue: 0.8, industryAvg: 2.1, topPerformer: 0.3, unit: '/month', status: 'above', category: 'Safety', trend: 'down', change: -25 },
  ],
  manufacturing: [
    { metric: 'OEE', yourValue: 85, industryAvg: 85, topPerformer: 95, unit: '%', status: 'average', category: 'Efficiency', trend: 'stable', change: 0 },
    { metric: 'Defect Rate', yourValue: 1.2, industryAvg: 2.5, topPerformer: 0.5, unit: '%', status: 'above', category: 'Quality', trend: 'down', change: -20 },
    { metric: 'Safety Incidents', yourValue: 0, industryAvg: 2, topPerformer: 0, unit: '/month', status: 'above', category: 'Safety', trend: 'stable', change: 0 },
    { metric: 'Equipment Uptime', yourValue: 94, industryAvg: 88, topPerformer: 98, unit: '%', status: 'above', category: 'Reliability', trend: 'up', change: 7 },
    { metric: 'Production Yield', yourValue: 96, industryAvg: 92, topPerformer: 99, unit: '%', status: 'above', category: 'Quality', trend: 'up', change: 4 },
  ],
  healthcare: [
    { metric: 'Patient Wait Time', yourValue: 8, industryAvg: 15, topPerformer: 5, unit: 'min', status: 'above', category: 'Operations', trend: 'down', change: -25 },
    { metric: 'Bed Occupancy', yourValue: 82, industryAvg: 78, topPerformer: 88, unit: '%', status: 'above', category: 'Efficiency', trend: 'up', change: 5 },
    { metric: 'Security Incidents', yourValue: 0.5, industryAvg: 1.8, topPerformer: 0.2, unit: '/month', status: 'above', category: 'Safety', trend: 'down', change: -30 },
    { metric: 'Staff Response Time', yourValue: 2.1, industryAvg: 3.5, topPerformer: 1.5, unit: 'min', status: 'above', category: 'Operations', trend: 'down', change: -15 },
  ],
  transportation: [
    { metric: 'On-Time Performance', yourValue: 94, industryAvg: 88, topPerformer: 98, unit: '%', status: 'above', category: 'Operations', trend: 'up', change: 8 },
    { metric: 'Incident Detection', yourValue: 96, industryAvg: 85, topPerformer: 99, unit: '%', status: 'above', category: 'Safety', trend: 'up', change: 12 },
    { metric: 'Passenger Satisfaction', yourValue: 4.2, industryAvg: 3.8, topPerformer: 4.7, unit: '/5', status: 'above', category: 'Service', trend: 'up', change: 10 },
    { metric: 'Congestion Reduction', yourValue: 22, industryAvg: 15, topPerformer: 35, unit: '%', status: 'above', category: 'Efficiency', trend: 'up', change: 18 },
  ],
}

export function IndustryBenchmarksPage() {
  const [industry, setIndustry] = useState<IndustryType | null>(null)
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const saved = localStorage.getItem('industryProfile') as IndustryType | null
    if (saved && saved in benchmarkData) {
      setIndustry(saved)
      setBenchmarks(benchmarkData[saved])
    } else {
      setIndustry('smart-city' as IndustryType)
      setBenchmarks(benchmarkData['smart-city'])
    }
  }, [])

  const profile = industry ? getIndustryProfile(industry) : null

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(benchmarks.map(b => b.category)))]
  
  // Filter benchmarks by category
  const filteredBenchmarks = selectedCategory === 'all' 
    ? benchmarks 
    : benchmarks.filter(b => b.category === selectedCategory)

  // Calculate stats
  const aboveAverage = benchmarks.filter(b => b.status === 'above').length
  const totalMetrics = benchmarks.length
  const avgImprovement = benchmarks.reduce((sum, b) => sum + Math.abs(b.change), 0) / totalMetrics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading>Industry Benchmarks</Heading>
          <Text className="mt-2">Compare your performance with industry standards</Text>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </Select>
          <Button plain>Export Report</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <TrophyIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Text className="text-xs">Above Average</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
                {aboveAverage}/{totalMetrics}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <ChartBarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Text className="text-xs">Performance Score</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
                {Math.round((aboveAverage / totalMetrics) * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <TrendingUpIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <Text className="text-xs">Avg Improvement</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
                {avgImprovement.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <ChartBarIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <Text className="text-xs">Total Metrics</Text>
              <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
                {totalMetrics}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Profile Banner */}
      {profile && (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{profile.icon}</span>
              <div>
                <Subheading className="text-white">{profile.name}</Subheading>
                <Text className="text-white/80 mt-1">
                  Benchmarking against {totalMetrics} key performance indicators
                </Text>
              </div>
            </div>
            <Badge color="zinc">
              {Math.round((aboveAverage / totalMetrics) * 100)}% Above Average
            </Badge>
          </div>
        </div>
      )}

      {/* Benchmarks Grid */}
      <div className="space-y-4">
        {filteredBenchmarks.map((benchmark, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Subheading>{benchmark.metric}</Subheading>
                  <Badge color={benchmark.status === 'above' ? 'green' : benchmark.status === 'average' ? 'amber' : 'red'}>
                    {benchmark.status === 'above' ? 'Above Average' : benchmark.status === 'average' ? 'Average' : 'Below Average'}
                  </Badge>
                  <Badge color="zinc">{benchmark.category}</Badge>
                </div>
                
                {/* Trend Indicator */}
                <div className="flex items-center gap-2">
                  {benchmark.trend === 'up' && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingUpIcon className="w-4 h-4" />
                      <Text className="text-xs font-medium">+{Math.abs(benchmark.change)}%</Text>
                    </div>
                  )}
                  {benchmark.trend === 'down' && benchmark.change < 0 && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingDownIcon className="w-4 h-4" />
                      <Text className="text-xs font-medium">{benchmark.change}% (Improved)</Text>
                    </div>
                  )}
                  {benchmark.trend === 'down' && benchmark.change > 0 && (
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <TrendingDownIcon className="w-4 h-4" />
                      <Text className="text-xs font-medium">{benchmark.change}%</Text>
                    </div>
                  )}
                  {benchmark.trend === 'stable' && (
                    <Text className="text-xs text-zinc-500">No change</Text>
                  )}
                  <Text className="text-xs text-zinc-500">vs last period</Text>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Your Value</Text>
                <div className="text-3xl font-semibold text-zinc-950 dark:text-white">
                  {benchmark.yourValue}{benchmark.unit}
                </div>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Industry Average</Text>
                <div className="text-3xl font-semibold text-zinc-600 dark:text-zinc-400">
                  {benchmark.industryAvg}{benchmark.unit}
                </div>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Top Performer</Text>
                <div className="text-3xl font-semibold text-amber-600 dark:text-amber-400">
                  {benchmark.topPerformer}{benchmark.unit}
                </div>
              </div>
            </div>

            {/* Progress Bar Visualization */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                <span>0</span>
                <span>Industry Avg</span>
                <span>Top Performer</span>
              </div>
              <div className="relative h-6 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                {/* Industry Average Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-zinc-400 dark:bg-zinc-500"
                  style={{ left: `${(benchmark.industryAvg / benchmark.topPerformer) * 100}%` }}
                />
                {/* Your Value Bar */}
                <div 
                  className={`absolute h-full rounded-full transition-all ${
                    benchmark.status === 'above' ? 'bg-green-500' : 
                    benchmark.status === 'average' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((benchmark.yourValue / benchmark.topPerformer) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBenchmarks.length === 0 && (
        <div className="text-center py-12">
          <ChartBarIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <Subheading>No benchmarks available</Subheading>
          <Text className="mt-2">Select a different category or industry to view benchmarks</Text>
        </div>
      )}
    </div>
  )
}


