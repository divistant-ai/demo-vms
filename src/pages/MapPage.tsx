import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { cameraApi } from '../services/api/cameraApi'
import { LoadingState } from '../utils/loadingStates'
import { useNavigate } from 'react-router-dom'
import { useRealtimeData } from '../hooks/useRealtimeData'

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
  const [showMetricsPanel, setShowMetricsPanel] = useState(false)
  const navigate = useNavigate()
  
  // Realtime data streaming
  const realtimeData = useRealtimeData()

  const { data: cameras = [], isLoading, isError, error } = useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraApi.getAll(),
    initialData: realtimeData.cameras,
  })
  
  // Use realtime cameras for display
  const displayCameras = realtimeData.cameras || cameras

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

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <Heading>Error Loading Map</Heading>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {error instanceof Error ? error.message : 'Failed to load camera data'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Filter cameras based on selected use case
  const filteredCameras = filters.useCase === 'all' ? displayCameras : displayCameras.filter((camera: any) => {
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
    <div className="h-[calc(100vh-4rem)] flex flex-col">
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
        
        {/* Heatmap Overlay - Shows when camera is selected */}
        {showHeatmap && heatmapData && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Generate heatmap zones based on camera type */}
            <div className="absolute inset-0">
              {/* Traffic Heatmap - Road congestion zones */}
              {heatmapData.type === 'traffic' && (
                <>
                  {/* High congestion zone */}
                  <div className="absolute bg-red-500/40 rounded-full blur-3xl animate-pulse"
                    style={{ top: '38%', left: '46%', width: '120px', height: '80px' }} />
                  <div className="absolute bg-orange-500/30 rounded-full blur-2xl"
                    style={{ top: '42%', left: '50%', width: '100px', height: '70px' }} />
                  <div className="absolute bg-yellow-500/25 rounded-full blur-xl"
                    style={{ top: '40%', left: '48%', width: '140px', height: '90px' }} />
                </>
              )}
              
              {/* Flood Heatmap - Water level zones */}
              {heatmapData.type === 'flood' && (
                <>
                  <div className="absolute bg-blue-600/50 rounded-full blur-3xl animate-pulse"
                    style={{ top: '40%', left: '47%', width: '150px', height: '100px' }} />
                  <div className="absolute bg-cyan-500/40 rounded-full blur-2xl"
                    style={{ top: '44%', left: '50%', width: '120px', height: '80px' }} />
                </>
              )}
              
              {/* Crowd Heatmap - People density zones */}
              {heatmapData.type === 'crowd' && (
                <>
                  <div className="absolute bg-purple-500/45 rounded-full blur-3xl animate-pulse"
                    style={{ top: '39%', left: '48%', width: '110px', height: '110px' }} />
                  <div className="absolute bg-pink-500/35 rounded-full blur-2xl"
                    style={{ top: '41%', left: '46%', width: '90px', height: '90px' }} />
                  <div className="absolute bg-purple-400/25 rounded-full blur-xl"
                    style={{ top: '43%', left: '50%', width: '80px', height: '80px' }} />
                </>
              )}
              
              {/* Security Heatmap - Activity zones */}
              {heatmapData.type === 'security' && (
                <>
                  <div className="absolute bg-red-600/40 rounded-full blur-2xl animate-pulse"
                    style={{ top: '40%', left: '48%', width: '100px', height: '100px' }} />
                  <div className="absolute bg-orange-500/30 rounded-full blur-xl"
                    style={{ top: '38%', left: '50%', width: '80px', height: '80px' }} />
                </>
              )}
              
              {/* Safety Heatmap - Compliance zones */}
              {heatmapData.type === 'safety' && (
                <>
                  <div className="absolute bg-green-500/40 rounded-full blur-3xl"
                    style={{ top: '41%', left: '47%', width: '130px', height: '90px' }} />
                  <div className="absolute bg-yellow-500/35 rounded-full blur-2xl animate-pulse"
                    style={{ top: '39%', left: '49%', width: '100px', height: '70px' }} />
                </>
              )}
              
              {/* Stevedoring Heatmap - Cargo activity */}
              {heatmapData.type === 'stevedoring' && (
                <>
                  <div className="absolute bg-amber-500/45 rounded-full blur-3xl animate-pulse"
                    style={{ top: '40%', left: '48%', width: '140px', height: '95px' }} />
                  <div className="absolute bg-orange-500/35 rounded-full blur-2xl"
                    style={{ top: '42%', left: '46%', width: '110px', height: '75px' }} />
                </>
              )}
              
              {/* Default heatmap for other types */}
              {!['traffic', 'flood', 'crowd', 'security', 'safety', 'stevedoring'].includes(heatmapData.type) && (
                <>
                  <div className="absolute bg-blue-500/40 rounded-full blur-3xl animate-pulse"
                    style={{ top: '40%', left: '48%', width: '120px', height: '85px' }} />
                  <div className="absolute bg-indigo-500/30 rounded-full blur-2xl"
                    style={{ top: '42%', left: '50%', width: '100px', height: '70px' }} />
                </>
              )}
            </div>
            
            {/* Heatmap Legend */}
            <div className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-sm rounded-lg p-4 pointer-events-auto">
              <div className="text-white text-sm font-semibold mb-3">Heatmap Legend</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3 rounded bg-gradient-to-r from-blue-500 to-blue-600"></div>
                  <span className="text-xs text-gray-300">Low Activity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3 rounded bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                  <span className="text-xs text-gray-300">Medium Activity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-3 rounded bg-gradient-to-r from-orange-500 to-red-500"></div>
                  <span className="text-xs text-gray-300">High Activity</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowHeatmap(false)
                  setShowMetricsPanel(false)
                  setSelectedCamera(null)
                }}
                className="mt-4 w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white text-xs font-medium transition-colors"
              >
                Clear Heatmap
              </button>
            </div>
          </div>
        )}

        {/* Camera Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredCameras.map((camera: any, index: number) => {
            // Generate well-distributed positions across wider Jakarta area
            const positions = [
              { top: '25%', left: '35%' },  // Far North-West
              { top: '30%', left: '60%' },  // Far North-East
              { top: '35%', left: '45%' },  // North Downtown
              { top: '40%', left: '30%' },  // West Jakarta
              { top: '40%', left: '50%' },  // Central Jakarta
              { top: '40%', left: '65%' },  // East Jakarta
              { top: '45%', left: '40%' },  // South-West
              { top: '45%', left: '55%' },  // South-East
              { top: '50%', left: '48%' },  // Far South Central
              { top: '55%', left: '35%' },  // Far South-West
              { top: '55%', left: '58%' },  // Far South-East
              { top: '35%', left: '70%' },  // Far East
              { top: '48%', left: '25%' },  // Far West
              { top: '28%', left: '48%' },  // North Central
            ]
            
            const position = positions[index % positions.length]
            
            return (
              <div
                key={camera.id}
                className="absolute pointer-events-auto cursor-pointer group"
                style={{ 
                  top: position.top, 
                  left: position.left,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 100 
                }}
                onClick={() => {
                  const heatmap = generateCameraHeatmap(camera)
                  setSelectedCamera(camera)
                  setHeatmapData(heatmap)
                  setShowHeatmap(true)
                  setShowMetricsPanel(true)
                }}
              >
                {/* Camera Icon with Pulse Animation */}
                <div className="relative">
                  {/* Pulse ring for online cameras */}
                  {camera.status === 'online' && (
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
                  )}
                  
                  {/* Camera Icon */}
                  <div className={`
                    relative w-10 h-10 rounded-lg shadow-xl border-2 border-white
                    flex items-center justify-center
                    transition-all duration-200
                    group-hover:scale-125 group-hover:shadow-2xl group-hover:z-50
                    ${camera.status === 'online' ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}
                  `}>
                    {/* Camera SVG Icon */}
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    
                    {/* Status Indicator */}
                    <div className={`
                      absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white
                      ${camera.status === 'online' ? 'bg-green-400' : 'bg-red-400'}
                    `}></div>
                  </div>
                </div>
                
                {/* Enhanced Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs px-4 py-3 rounded-lg shadow-2xl min-w-[200px]">
                    <div className="font-semibold text-sm mb-1">{camera.name}</div>
                    <div className="text-gray-300 text-xs mb-2">
                      {typeof camera.location === 'string' ? camera.location : camera.location?.address || 'Unknown Location'}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`inline-block w-2 h-2 rounded-full ${camera.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="capitalize">{camera.status}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                      Click to view heatmap
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Metrics Side Panel */}
      {showMetricsPanel && heatmapData && selectedCamera && (
        <div className="absolute top-4 right-4 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[calc(100vh-8rem)] overflow-y-auto mx-4 sm:mx-0">
          {/* Panel Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">{selectedCamera.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{heatmapData.title}</p>
            </div>
            <button
              onClick={() => {
                setShowMetricsPanel(false)
                setShowHeatmap(false)
                setSelectedCamera(null)
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Panel Body */}
          <div className="p-4 space-y-4">
            {/* Camera Overview */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Camera Overview</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`ml-1 font-medium ${selectedCamera.status === 'online' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {selectedCamera.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {typeof selectedCamera.location === 'string' ? selectedCamera.location : selectedCamera.location?.zone || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {heatmapData.description}
            </div>

            {/* Metrics Grid */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">Real-time Metrics</div>
              {heatmapData.metrics.map((metric: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400">{metric.label}</div>
                  <div className="flex items-baseline justify-between mt-1">
                    <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                    <div className={`text-xs font-medium ${
                      metric.trend.includes('+') ? 'text-green-600 dark:text-green-400' :
                      metric.trend.includes('-') ? 'text-red-600 dark:text-red-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {metric.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/cameras/${selectedCamera.id}`)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
            </div>

            {/* Heatmap Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-xs text-blue-900 dark:text-blue-100">
                  The heatmap overlay on the map shows activity intensity zones. Red areas indicate high activity, while blue areas show low activity.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

