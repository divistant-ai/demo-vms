import { useState } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'

type AIModel = {
  id: string
  name: string
  description: string
  category: string
  accuracy: number
  industries: string[]
  useCase: string
  installed: boolean
  pricing: string
}

const aiModels: AIModel[] = [
  { id: 'person-detection', name: 'Person Detection', description: 'Advanced person detection and tracking', category: 'Detection', accuracy: 98, industries: ['all'], useCase: 'crowd_monitoring', installed: true, pricing: 'Free' },
  { id: 'vehicle-detection', name: 'Vehicle Detection', description: 'Detect and classify vehicles', category: 'Detection', accuracy: 96, industries: ['logistics', 'smart_city'], useCase: 'vehicle_tracking', installed: true, pricing: 'Free' },
  { id: 'face-recognition', name: 'Face Recognition', description: 'Identify individuals by facial features', category: 'Recognition', accuracy: 99, industries: ['retail', 'manufacturing'], useCase: 'access_control', installed: false, pricing: '$99/mo' },
  { id: 'license-plate', name: 'License Plate Recognition', description: 'Read vehicle license plates', category: 'Recognition', accuracy: 97, industries: ['logistics', 'smart_city'], useCase: 'vehicle_tracking', installed: false, pricing: '$49/mo' },
  { id: 'behavior-analysis', name: 'Behavior Analysis', description: 'Detect suspicious behavior patterns', category: 'Analysis', accuracy: 92, industries: ['retail', 'smart_city'], useCase: 'intrusion_detection', installed: false, pricing: '$149/mo' },
  { id: 'crowd-density', name: 'Crowd Density Estimation', description: 'Estimate crowd density in real-time', category: 'Analysis', accuracy: 94, industries: ['retail', 'smart_city'], useCase: 'crowd_monitoring', installed: true, pricing: 'Free' },
]

export function AIModelsMarketplacePage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? aiModels : 
                   filter === 'installed' ? aiModels.filter(m => m.installed) :
                   aiModels.filter(m => m.category === filter)

  const handleInstall = (id: string) => {
    alert(`Installing ${aiModels.find(m => m.id === id)?.name}...`)
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading>AI Models Marketplace</Heading>
        <Text className="mt-2">Industry-specific AI models for your use cases</Text>
      </div>

      <div className="flex gap-2">
        {['all', 'installed', 'Detection', 'Recognition', 'Analysis'].map(f => (
          <Button key={f} color={filter === f ? 'blue' : 'zinc'} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(model => (
          <div key={model.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-3">
              <Heading level={3}>{model.name}</Heading>
              <Badge color="green">{model.accuracy}%</Badge>
            </div>
            
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">{model.description}</Text>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="blue" className="text-xs">{model.category}</Badge>
              <Badge color="purple" className="text-xs">{model.pricing}</Badge>
            </div>

            {model.installed ? (
              <Button color="green" className="w-full" disabled>✓ Installed</Button>
            ) : (
              <Button color="blue" className="w-full" onClick={() => handleInstall(model.id)}>
                Install Model
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
