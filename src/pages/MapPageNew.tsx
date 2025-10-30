import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Dialog, DialogTitle, DialogBody } from '../components/catalyst/dialog'
import { cameraApi } from '../services/api/cameraApi'
import { LoadingState } from '../utils/loadingStates'

// Simple Map Filters
function MapFilters({ onFilterChange, filters }: {
  onFilterChange: (key: string, value: string) => void
  filters: any
}) {
  const useCaseTypes = [
    { value: 'all', label: '🗺️ All', color: 'gray' },
    { value: 'traffic', label: '🚗 Traffic', color: 'blue' },
    { value: 'flood', label: '🌊 Flood', color: 'cyan' },
    { value: 'crowd', label: '👥 Crowd', color: 'purple' },
    { value: 'security', label: '🔒 Security', color: 'red' },
    { value: 'safety', label: '⚠️ Safety', color: 'orange' },
    { value: 'stevedoring', label: '📦 Cargo', color: 'amber' },
    { value: 'vessel', label: '⛴️ Vessel', color: 'indigo' },
    { value: 'stockpile', label: '⛰️ Stockpile', color: 'emerald' },
    { value: 'fleet', label: '🚢 Fleet', color: 'teal' },
  ]

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-600',
    blue: 'bg-blue-600',
    cyan: 'bg-cyan-600',
    purple: 'bg-purple-600',
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    amber: 'bg-amber-600',
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    teal: 'bg-teal-600',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {useCaseTypes.map(type => (
        <button
          key={type.value}
          onClick={() => onFilterChange('useCase', type.value)}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${filters.useCase === type.value 
              ? `${colorClasses[type.color]} text-white shadow-lg scale-105` 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:shadow-md hover:scale-102'
            }
          `}
        >
          {type.label}
        </button>
      ))}
    </div>
  )
}

export function MapPage() {
  const [filters, setFilters] = useState({
    useCase: 'all'
  })
  const [selectedCamera, setSelectedCamera] = useState<any>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [heatmapData, setHeatmapData] = useState<any>(null)

  const { data: cameras = [], isLoading } = useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraApi.getAll(),
  })

  const generateCameraHeatmap = (camera: any) => {
    const cameraName = camera.name.toLowerCase()
    const scenarios = camera.activeScenarios || []
    
    // Generate heatmap based on camera type
    if (cameraName.includes('traffic') || cameraName.includes('junction') || scenarios.includes('scenario-001')) {
      return {
        type: 'traffic',
        title: 'Traffic Flow Heatmap',
        description: 'Real-time traffic density and flow patterns',
        metrics: [
          { label: 'Avg. Vehicle Count', value: '156/hour', trend: '+12%' },
          { label: 'Avg. Speed', value: '35 km/h', trend: '-5%' },
          { label: 'Congestion Level', value: 'Medium', trend: 'stable' },
        ]
      }
    } else if (cameraName.includes('flood') || cameraName.includes('river') || scenarios.includes('scenario-002')) {
      return {
        type: 'flood',
        title: 'Flood Monitoring Heatmap',
        description: 'Water level and flood risk assessment',
        metrics: [
          { label: 'Water Level', value: '1.2m', trend: '+0.3m' },
          { label: 'Risk Level', value: 'Low', trend: 'stable' },
          { label: 'Flow Rate', value: '2.5 m/s', trend: '+0.5' },
        ]
      }
    } else if (cameraName.includes('mall') || cameraName.includes('entrance') || scenarios.includes('scenario-003')) {
      return {
        type: 'crowd',
        title: 'Crowd Density Heatmap',
        description: 'People count and movement patterns',
        metrics: [
          { label: 'Current Count', value: '234 people', trend: '+45' },
          { label: 'Density', value: 'High', trend: 'increasing' },
          { label: 'Movement', value: 'Active', trend: 'stable' },
        ]
      }
    } else if (cameraName.includes('security') || cameraName.includes('perimeter') || scenarios.includes('scenario-004')) {
      return {
        type: 'security',
        title: 'Security Activity Heatmap',
        description: 'Intrusion detection and perimeter monitoring',
        metrics: [
          { label: 'Alert Level', value: 'Normal', trend: 'stable' },
          { label: 'Detections', value: '0 today', trend: 'stable' },
          { label: 'Status', value: 'Secure', trend: 'stable' },
        ]
      }
    }
    // ABL Use Cases
    else if (cameraName.includes('safety') || cameraName.includes('hse') || scenarios.includes('scenario-005')) {
      return {
        type: 'safety',
        title: 'Safety & HSE Monitoring',
        description: 'PPE compliance and safety behavior analytics',
        metrics: [
          { label: 'PPE Compliance', value: '95%', trend: '+3%' },
          { label: 'Incidents', value: '0 today', trend: 'stable' },
          { label: 'Safety Score', value: 'A+', trend: 'stable' },
        ]
      }
    } else if (cameraName.includes('stevedoring') || cameraName.includes('cargo') || scenarios.includes('scenario-006')) {
      return {
        type: 'stevedoring',
        title: 'Stevedoring Operations',
        description: 'Cargo loading/unloading monitoring',
        metrics: [
          { label: 'Containers', value: '45 units', trend: '+12' },
          { label: 'Efficiency', value: '92%', trend: '+5%' },
          { label: 'Activity', value: 'Active', trend: 'stable' },
        ]
      }
    } else if (cameraName.includes('vessel') || cameraName.includes('ship') || scenarios.includes('scenario-007')) {
      return {
        type: 'vessel',
        title: 'Vessel Condition Monitoring',
        description: 'Hull and equipment condition assessment',
        metrics: [
          { label: 'Condition', value: 'Good', trend: 'stable' },
          { label: 'Maintenance', value: 'Up-to-date', trend: 'stable' },
          { label: 'Alerts', value: '0', trend: 'stable' },
        ]
      }
    } else if (cameraName.includes('stockpile') || cameraName.includes('conveyor') || scenarios.includes('scenario-008')) {
      return {
        type: 'stockpile',
        title: 'Stockpile & Conveyor Monitoring',
        description: 'Volume measurement and belt monitoring',
        metrics: [
          { label: 'Volume', value: '1,250 tons', trend: '+150' },
          { label: 'Belt Speed', value: '2.5 m/s', trend: 'stable' },
          { label: 'Status', value: 'Operational', trend: 'stable' },
        ]
      }
    } else if (cameraName.includes('fleet') || cameraName.includes('barge') || scenarios.includes('scenario-009')) {
      return {
        type: 'fleet',
        title: 'Fleet Tracking & Traceability',
        description: 'Visual tracking of barges and tongkang',
        metrics: [
          { label: 'Tracked Vessels', value: '12 units', trend: 'stable' },
          { label: 'On Schedule', value: '100%', trend: 'stable' },
          { label: 'Location', value: 'Port A', trend: 'stable' },
        ]
      }
    }

    return {
      type: 'default',
      title: 'Camera Monitoring',
      description: 'General camera monitoring',
      metrics: [
        { label: 'Status', value: 'Online', trend: 'stable' },
        { label: 'Uptime', value: '99.9%', trend: 'stable' },
        { label: 'Quality', value: 'HD', trend: 'stable' },
      ]
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading map data..." />
  }

  // Filter cameras based on selected use case
  const filteredCameras = filters.useCase === 'all' ? cameras : cameras.filter((camera: any) => {
    const name = camera.name.toLowerCase()
    const useCase = filters.useCase
    
    if (useCase === 'traffic') return name.includes('traffic') || name.includes('junction')
    if (useCase === 'flood') return name.includes('flood') || name.includes('river')
    if (useCase === 'crowd') return name.includes('mall') || name.includes('entrance')
    if (useCase === 'security') return name.includes('security') || name.includes('perimeter')
    if (useCase === 'safety') return name.includes('safety') || name.includes('hse')
    if (useCase === 'stevedoring') return name.includes('stevedoring') || name.includes('cargo')
    if (useCase === 'vessel') return name.includes('vessel') || name.includes('ship')
    if (useCase === 'stockpile') return name.includes('stockpile') || name.includes('conveyor')
    if (useCase === 'fleet') return name.includes('fleet') || name.includes('barge')
    
    return true
  })

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white dark:bg-gray-900">
      {/* Header with Filters - Fixed */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm">
        <div className="mb-3">
          <Heading>Geographic Visualization</Heading>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {filteredCameras.length} cameras • Click camera markers to view heatmap
          </p>
        </div>
        <MapFilters 
          filters={filters}
          onFilterChange={(key, value) => setFilters({ ...filters, [key]: value })}
        />
      </div>

      {/* Map Container - Full Height */}
      <div className="flex-1 relative overflow-hidden">
        {/* Embedded Google Maps */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3216029518497!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDknMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
        
        {/* Camera Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredCameras.map((camera: any, index: number) => {
            const lat = -6.2 + (index * 0.02) - 0.1
            const lng = 106.82 + (index * 0.015) - 0.075
            
            const top = ((90 - lat) / 180) * 100
            const left = ((lng + 180) / 360) * 100
            
            return (
              <div
                key={camera.id}
                className="absolute pointer-events-auto cursor-pointer group transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  top: `${top}%`, 
                  left: `${left}%`,
                  zIndex: 100 
                }}
                onClick={() => {
                  const heatmap = generateCameraHeatmap(camera)
                  setSelectedCamera(camera)
                  setHeatmapData(heatmap)
                  setShowHeatmap(true)
                }}
              >
                {/* Camera Pin */}
                <div className={`
                  w-8 h-8 rounded-full shadow-lg border-2 border-white
                  flex items-center justify-center
                  transition-all duration-200
                  group-hover:scale-125 group-hover:shadow-xl
                  ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'}
                `}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                    <circle cx="10" cy="10" r="2" fill="white" />
                  </svg>
                </div>
                
                {/* Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                    {camera.name}
                    <div className="text-gray-300 text-xs">
                      {typeof camera.location === 'string' ? camera.location : camera.location?.address || 'Unknown Location'}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Heatmap Dialog */}
      {showHeatmap && heatmapData && selectedCamera && (
        <Dialog open={showHeatmap} onClose={() => setShowHeatmap(false)} size="3xl">
          <DialogTitle>{heatmapData.title}</DialogTitle>
          <DialogBody>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">{selectedCamera.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{heatmapData.description}</p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4">
                {heatmapData.metrics.map((metric: any, index: number) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                    <div className="text-2xl font-bold mt-1">{metric.value}</div>
                    <div className={`text-xs mt-1 ${
                      metric.trend.includes('+') ? 'text-green-600' :
                      metric.trend.includes('-') ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {metric.trend}
                    </div>
                  </div>
                ))}
              </div>

              {/* Heatmap Visualization Placeholder */}
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-64 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="font-semibold">Heatmap Visualization</div>
                  <div className="text-sm opacity-80">Activity intensity over time</div>
                </div>
              </div>
            </div>
          </DialogBody>
        </Dialog>
      )}
    </div>
  )
}

