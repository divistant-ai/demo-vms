import { useState } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Input } from '../components/catalyst/input'
import { Link } from 'react-router-dom'

// Custom SVG Icons
function PlusIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 5v10M5 10h10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MagnifyingGlassIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM17 17l-4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M5 3l10 7-10 7V3Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M6 3h2v14H6V3ZM12 3h2v14h-2V3Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M3 6h14M8 6V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m3 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h10Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM10 6v4l2 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

type Scenario = {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'draft'
  triggers: string[]
  actions: string[]
  lastTriggered?: Date
  triggerCount: number
  createdAt: Date
  updatedAt: Date
}

const mockScenarios: Scenario[] = [
  {
    id: '1',
    name: 'Traffic Congestion Alert',
    description: 'Automatically detect traffic congestion and send alerts to operators',
    status: 'active',
    triggers: ['Traffic density > 80%', 'Average speed < 20 km/h'],
    actions: ['Send alert', 'Notify traffic control', 'Update digital signage'],
    lastTriggered: new Date(Date.now() - 30 * 60000),
    triggerCount: 45,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60000)
  },
  {
    id: '2',
    name: 'Flood Detection & Response',
    description: 'Monitor water levels and activate emergency protocols',
    status: 'active',
    triggers: ['Water level > threshold', 'Heavy rainfall detected'],
    actions: ['Sound alarm', 'Send SMS alerts', 'Activate pumps', 'Close gates'],
    lastTriggered: new Date(Date.now() - 2 * 60 * 60000),
    triggerCount: 12,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60000)
  },
  {
    id: '3',
    name: 'Perimeter Intrusion',
    description: 'Detect unauthorized access and trigger security response',
    status: 'active',
    triggers: ['Motion detected after hours', 'Fence breach detected'],
    actions: ['Record video', 'Send security alert', 'Turn on lights', 'Lock doors'],
    lastTriggered: new Date(Date.now() - 5 * 60 * 60000),
    triggerCount: 8,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60000)
  },
  {
    id: '4',
    name: 'Crowd Management',
    description: 'Monitor crowd density and prevent overcrowding',
    status: 'inactive',
    triggers: ['Crowd density > 85%', 'Queue length > 50 people'],
    actions: ['Send alert', 'Display warning', 'Redirect crowd flow'],
    triggerCount: 23,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000)
  },
  {
    id: '5',
    name: 'Fire & Smoke Detection',
    description: 'Early fire detection and emergency evacuation',
    status: 'draft',
    triggers: ['Smoke detected', 'Temperature spike', 'Fire alarm triggered'],
    actions: ['Sound evacuation alarm', 'Call fire department', 'Unlock emergency exits'],
    triggerCount: 0,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000)
  }
]

export function ScenariosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [scenarios, setScenarios] = useState(mockScenarios)

  const filteredScenarios = scenarios.filter((scenario) =>
    scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleStatus = (id: string) => {
    setScenarios(scenarios.map(s => 
      s.id === id 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' | 'draft' }
        : s
    ))
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      setScenarios(scenarios.filter(s => s.id !== id))
    }
  }

  const getStatusColor = (status: string): 'green' | 'red' | 'yellow' | 'zinc' => {
    switch (status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'red'
      case 'draft':
        return 'yellow'
      default:
        return 'zinc'
    }
  }

  const activeCount = scenarios.filter(s => s.status === 'active').length
  const totalTriggers = scenarios.reduce((sum, s) => sum + s.triggerCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading>AI Scenarios</Heading>
          <Text className="mt-2">
            Automate responses to detected events with custom scenarios
          </Text>
        </div>
        <Link to="/configuration/scenarios/new">
          <Button color="blue">
            <PlusIcon />
            Create Scenario
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Total Scenarios</Text>
              <Heading className="text-2xl mt-1">{scenarios.length}</Heading>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Active Scenarios</Text>
              <Heading className="text-2xl mt-1 text-green-600">{activeCount}</Heading>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Total Triggers</Text>
              <Heading className="text-2xl mt-1">{totalTriggers}</Heading>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-600">
              <PlayIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search scenarios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Subheading>{scenario.name}</Subheading>
                  <Badge color={getStatusColor(scenario.status)}>
                    {scenario.status}
                  </Badge>
                </div>
                <Text className="text-sm text-zinc-600 dark:text-zinc-400">
                  {scenario.description}
                </Text>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  TRIGGERS ({scenario.triggers.length})
                </Text>
                <div className="flex flex-wrap gap-2">
                  {scenario.triggers.map((trigger, idx) => (
                    <Badge key={idx} color="zinc">
                      {trigger}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                  ACTIONS ({scenario.actions.length})
                </Text>
                <div className="flex flex-wrap gap-2">
                  {scenario.actions.map((action, idx) => (
                    <Badge key={idx} color="blue">
                      {action}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>{scenario.triggerCount} triggers</span>
                </div>
                {scenario.lastTriggered && (
                  <Text className="text-xs">
                    Last: {scenario.lastTriggered.toLocaleString()}
                  </Text>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  color="zinc"
                  onClick={() => handleToggleStatus(scenario.id)}
                  title={scenario.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {scenario.status === 'active' ? <PauseIcon /> : <PlayIcon />}
                </Button>
                <Link to={`/configuration/scenarios/${scenario.id}`}>
                  <Button color="zinc">
                    <PencilIcon />
                  </Button>
                </Link>
                <Button color="red" onClick={() => handleDelete(scenario.id)}>
                  <TrashIcon />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <ClockIcon className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <Heading className="text-xl mb-2">No scenarios found</Heading>
          <Text className="text-zinc-500 dark:text-zinc-400 mb-6">
            {searchQuery ? 'Try adjusting your search query' : 'Create your first scenario to automate responses'}
          </Text>
          <Link to="/configuration/scenarios/new">
            <Button color="blue">
              <PlusIcon />
              Create Scenario
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

