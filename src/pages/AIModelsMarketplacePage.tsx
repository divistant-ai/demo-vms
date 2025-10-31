import { useState } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'
import { Input } from '../components/catalyst/input'

// Custom SVG Icons
function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function DownloadIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  )
}

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  )
}

type AIModel = {
  id: string
  name: string
  description: string
  category: string
  accuracy: number
  industries: Array<string>
  useCase: string
  installed: boolean
  pricing: string
  downloads: number
  rating: number
  reviews: number
  version: string
  provider: string
  lastUpdated: string
}

const aiModels: Array<AIModel> = [
  { 
    id: 'person-detection', 
    name: 'Person Detection Pro', 
    description: 'Advanced person detection and tracking with pose estimation and re-identification capabilities', 
    category: 'Detection', 
    accuracy: 98, 
    industries: ['all'], 
    useCase: 'crowd_monitoring', 
    installed: true, 
    pricing: 'Free',
    downloads: 15420,
    rating: 4.8,
    reviews: 342,
    version: 'v2.1.0',
    provider: 'Visiant AI',
    lastUpdated: '2 days ago'
  },
  { 
    id: 'vehicle-detection', 
    name: 'Vehicle Detection & Classification', 
    description: 'Detect and classify vehicles by type, color, and make with high accuracy', 
    category: 'Detection', 
    accuracy: 96, 
    industries: ['logistics', 'smart_city'], 
    useCase: 'vehicle_tracking', 
    installed: true, 
    pricing: 'Free',
    downloads: 12850,
    rating: 4.7,
    reviews: 289,
    version: 'v1.9.2',
    provider: 'Visiant AI',
    lastUpdated: '1 week ago'
  },
  { 
    id: 'face-recognition', 
    name: 'Face Recognition Enterprise', 
    description: 'Identify individuals by facial features with anti-spoofing and liveness detection', 
    category: 'Recognition', 
    accuracy: 99, 
    industries: ['retail', 'manufacturing'], 
    useCase: 'access_control', 
    installed: false, 
    pricing: '$99/mo',
    downloads: 8920,
    rating: 4.9,
    reviews: 156,
    version: 'v3.0.1',
    provider: 'SecureVision Inc',
    lastUpdated: '3 days ago'
  },
  { 
    id: 'license-plate', 
    name: 'License Plate Recognition', 
    description: 'Read vehicle license plates from multiple countries with OCR technology', 
    category: 'Recognition', 
    accuracy: 97, 
    industries: ['logistics', 'smart_city'], 
    useCase: 'vehicle_tracking', 
    installed: false, 
    pricing: '$49/mo',
    downloads: 10340,
    rating: 4.6,
    reviews: 201,
    version: 'v2.5.0',
    provider: 'AutoVision Labs',
    lastUpdated: '5 days ago'
  },
  { 
    id: 'behavior-analysis', 
    name: 'Behavior Analysis AI', 
    description: 'Detect suspicious behavior patterns, loitering, and abnormal activities', 
    category: 'Analysis', 
    accuracy: 92, 
    industries: ['retail', 'smart_city'], 
    useCase: 'intrusion_detection', 
    installed: false, 
    pricing: '$149/mo',
    downloads: 6780,
    rating: 4.5,
    reviews: 98,
    version: 'v1.8.3',
    provider: 'SmartAnalytics Co',
    lastUpdated: '1 week ago'
  },
  { 
    id: 'crowd-density', 
    name: 'Crowd Density Estimation', 
    description: 'Estimate crowd density in real-time with heatmap visualization', 
    category: 'Analysis', 
    accuracy: 94, 
    industries: ['retail', 'smart_city'], 
    useCase: 'crowd_monitoring', 
    installed: true, 
    pricing: 'Free',
    downloads: 11230,
    rating: 4.7,
    reviews: 245,
    version: 'v2.0.0',
    provider: 'Visiant AI',
    lastUpdated: '4 days ago'
  },
  { 
    id: 'fire-smoke-detection', 
    name: 'Fire & Smoke Detection', 
    description: 'Early detection of fire and smoke with real-time alerts and location tracking', 
    category: 'Safety', 
    accuracy: 95, 
    industries: ['manufacturing', 'smart_city'], 
    useCase: 'safety_monitoring', 
    installed: false, 
    pricing: '$79/mo',
    downloads: 7450,
    rating: 4.8,
    reviews: 134,
    version: 'v1.6.0',
    provider: 'SafetyFirst AI',
    lastUpdated: '2 weeks ago'
  },
  { 
    id: 'ppe-detection', 
    name: 'PPE Compliance Detection', 
    description: 'Detect personal protective equipment (helmet, vest, gloves) compliance', 
    category: 'Safety', 
    accuracy: 93, 
    industries: ['manufacturing', 'logistics'], 
    useCase: 'safety_monitoring', 
    installed: false, 
    pricing: '$69/mo',
    downloads: 5920,
    rating: 4.6,
    reviews: 87,
    version: 'v2.2.1',
    provider: 'IndustrySafe AI',
    lastUpdated: '1 week ago'
  },
  { 
    id: 'object-tracking', 
    name: 'Multi-Object Tracking', 
    description: 'Track multiple objects simultaneously with trajectory prediction', 
    category: 'Tracking', 
    accuracy: 96, 
    industries: ['all'], 
    useCase: 'object_tracking', 
    installed: true, 
    pricing: 'Free',
    downloads: 13670,
    rating: 4.8,
    reviews: 298,
    version: 'v2.4.0',
    provider: 'Visiant AI',
    lastUpdated: '3 days ago'
  },
  { 
    id: 'anomaly-detection', 
    name: 'Anomaly Detection System', 
    description: 'Detect anomalies and unusual patterns using deep learning algorithms', 
    category: 'Analysis', 
    accuracy: 91, 
    industries: ['manufacturing', 'logistics'], 
    useCase: 'quality_control', 
    installed: false, 
    pricing: '$129/mo',
    downloads: 4560,
    rating: 4.4,
    reviews: 72,
    version: 'v1.5.2',
    provider: 'AnomalyAI Labs',
    lastUpdated: '2 weeks ago'
  },
  { 
    id: 'queue-management', 
    name: 'Queue Management AI', 
    description: 'Analyze queue length and wait times with customer flow optimization', 
    category: 'Analysis', 
    accuracy: 94, 
    industries: ['retail', 'healthcare'], 
    useCase: 'queue_management', 
    installed: false, 
    pricing: '$59/mo',
    downloads: 6340,
    rating: 4.7,
    reviews: 115,
    version: 'v1.9.0',
    provider: 'RetailVision Inc',
    lastUpdated: '5 days ago'
  },
  { 
    id: 'weapon-detection', 
    name: 'Weapon Detection System', 
    description: 'Detect weapons and dangerous objects for enhanced security', 
    category: 'Safety', 
    accuracy: 97, 
    industries: ['smart_city', 'retail'], 
    useCase: 'security_monitoring', 
    installed: false, 
    pricing: '$199/mo',
    downloads: 3890,
    rating: 4.9,
    reviews: 68,
    version: 'v1.3.0',
    provider: 'SecureVision Inc',
    lastUpdated: '1 week ago'
  },
]

export function AIModelsMarketplacePage() {
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = aiModels.filter(model => {
    const matchesFilter = filter === 'all' ? true : 
                         filter === 'installed' ? model.installed :
                         model.category === filter
    const matchesSearch = searchQuery === '' || 
                         model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleInstall = (id: string) => {
    const model = aiModels.find(m => m.id === id)
    alert(`Installing ${model?.name}...\n\nThis will:\n• Download model files\n• Configure dependencies\n• Run initial tests\n\nEstimated time: 2-5 minutes`)
  }

  const handleUninstall = (id: string) => {
    const model = aiModels.find(m => m.id === id)
    if (confirm(`Uninstall ${model?.name}?`)) {
      alert('Model uninstalled successfully')
    }
  }

  const installedCount = aiModels.filter(m => m.installed).length
  const totalDownloads = aiModels.reduce((sum, m) => sum + m.downloads, 0)
  const avgRating = (aiModels.reduce((sum, m) => sum + m.rating, 0) / aiModels.length).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading>AI Models Marketplace</Heading>
        <Text className="mt-2">Industry-specific AI models for your use cases</Text>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Available Models</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">{aiModels.length}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Installed</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">{installedCount}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Total Downloads</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">{(totalDownloads / 1000).toFixed(1)}K</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Avg Rating</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">{avgRating} ⭐</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'installed', 'Detection', 'Recognition', 'Analysis', 'Safety', 'Tracking'].map(f => (
            filter !== f ? (
              <Button key={f} plain onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'installed' ? 'Installed' : f}
              </Button>
            ) : (
              <Button key={f} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'installed' ? 'Installed' : f}
              </Button>
            )
          ))}
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(model => (
          <div key={model.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Subheading>{model.name}</Subheading>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{model.provider}</Text>
              </div>
              <Badge color="green">{model.accuracy}%</Badge>
            </div>
            
            <Text className="text-sm mb-4 line-clamp-2">{model.description}</Text>
            
            {/* Rating & Downloads */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1">
                <StarIcon className="w-4 h-4 text-amber-500" />
                <span className="font-medium">{model.rating}</span>
                <span className="text-zinc-500 dark:text-zinc-400">({model.reviews})</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                <DownloadIcon className="w-4 h-4" />
                <span>{(model.downloads / 1000).toFixed(1)}K</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="blue">{model.category}</Badge>
              <Badge color="purple">{model.pricing}</Badge>
              <Badge color="zinc">{model.version}</Badge>
            </div>

            {/* Meta Info */}
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Updated {model.lastUpdated}
            </Text>

            {/* Actions */}
            <div className="flex gap-2">
              {model.installed ? (
                <>
                  <Button color="green" className="flex-1" disabled>
                    ✓ Installed
                  </Button>
                  <Button plain onClick={() => handleUninstall(model.id)}>
                    Uninstall
                  </Button>
                </>
              ) : (
                <>
                  <Button className="flex-1" onClick={() => handleInstall(model.id)}>
                    Install
                  </Button>
                  <Button plain>Details</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <Subheading>No models found</Subheading>
          <Text className="mt-2">Try adjusting your search or filters</Text>
        </div>
      )}
    </div>
  )
}
