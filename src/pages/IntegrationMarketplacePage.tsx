import { useState } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'

type Integration = {
  id: string
  name: string
  description: string
  category: string
  logo: string
  connected: boolean
  popular: boolean
  industries: string[]
  features: string[]
  pricing: string
  setupTime: string
}

const integrations: Integration[] = [
  { id: 'pos', name: 'POS Systems', description: 'Connect with point-of-sale systems', category: 'Retail', logo: '🛒', connected: false, popular: true, industries: ['retail'], features: ['Sales data', 'Transaction sync', 'Customer insights'], pricing: 'Free', setupTime: '5 min' },
  { id: 'wms', name: 'Warehouse Management', description: 'Integrate with WMS platforms', category: 'Logistics', logo: '📦', connected: true, popular: true, industries: ['logistics'], features: ['Inventory sync', 'Shipment tracking', 'Real-time updates'], pricing: '$49/mo', setupTime: '15 min' },
  { id: 'erp', name: 'ERP Systems', description: 'Enterprise resource planning integration', category: 'Enterprise', logo: '🏢', connected: false, popular: true, industries: ['manufacturing', 'logistics'], features: ['Data sync', 'Process automation', 'Reporting'], pricing: '$99/mo', setupTime: '30 min' },
  { id: 'traffic', name: 'Traffic Control', description: 'Smart city traffic management', category: 'Smart City', logo: '🚦', connected: false, popular: true, industries: ['smart_city'], features: ['Signal control', 'Flow optimization', 'Incident alerts'], pricing: 'Custom', setupTime: '60 min' },
  { id: 'slack', name: 'Slack', description: 'Team communication and alerts', category: 'Communication', logo: '💬', connected: true, popular: true, industries: ['all'], features: ['Instant alerts', 'Team notifications', 'Bot commands'], pricing: 'Free', setupTime: '2 min' },
  { id: 'email', name: 'Email Notifications', description: 'Send alerts via email', category: 'Communication', logo: '📧', connected: true, popular: true, industries: ['all'], features: ['Alert emails', 'Reports', 'Customizable'], pricing: 'Free', setupTime: '1 min' },
]

export function IntegrationMarketplacePage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? integrations : 
                   filter === 'connected' ? integrations.filter(i => i.connected) :
                   integrations.filter(i => i.category === filter)

  const handleConnect = (id: string) => {
    alert(`Connecting to ${integrations.find(i => i.id === id)?.name}...`)
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading>Integration Marketplace</Heading>
        <Text className="mt-2">Connect with industry-specific tools and platforms</Text>
      </div>

      <div className="flex gap-2">
        {['all', 'connected', 'Retail', 'Logistics', 'Smart City', 'Communication'].map(f => (
          <Button key={f} color={filter === f ? 'blue' : 'zinc'} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map(integration => (
          <div key={integration.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-4xl mb-3">{integration.logo}</div>
            <Heading level={3} className="mb-2">{integration.name}</Heading>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">{integration.description}</Text>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {integration.features.map((f, i) => (
                <Badge key={i} color="blue" className="text-xs">{f}</Badge>
              ))}
            </div>

            {integration.connected ? (
              <Button color="green" className="w-full" disabled>✓ Connected</Button>
            ) : (
              <Button color="blue" className="w-full" onClick={() => handleConnect(integration.id)}>
                Connect
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

