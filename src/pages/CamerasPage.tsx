import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Hls from 'hls.js'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { Text } from '../components/catalyst/text'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { cameraApi } from '../services/api/cameraApi'
import { LoadingState } from '../utils/loadingStates'
import type { Camera } from '../types/camera'
import { format } from 'date-fns'
import { useRealtimeData } from '../hooks/useRealtimeData'

interface CameraMetrics {
  type: string
  label: string
  value: string | number
  unit?: string
  status?: 'normal' | 'warning' | 'critical'
}

function CameraMetricsDialog({ 
  camera, 
  isOpen, 
  onClose 
}: { 
  camera: Camera | null
  isOpen: boolean
  onClose: () => void 
}) {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState<CameraMetrics[]>([])
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [selectedMetric, setSelectedMetric] = useState<string>('')

  useEffect(() => {
    if (!camera || !isOpen) return

    // Generate metrics based on active scenarios and camera name
    const generatedMetrics: CameraMetrics[] = []
    const cameraName = camera.name.toLowerCase()
    const scenarios = camera.activeScenarios || []

    // Traffic Monitoring Metrics
    if (scenarios.includes('scenario-001') || cameraName.includes('traffic') || cameraName.includes('junction') || cameraName.includes('intersection')) {
      generatedMetrics.push(
        {
          type: 'traffic',
          label: 'Vehicle Count',
          value: Math.floor(Math.random() * 200) + 50,
          unit: 'vehicles',
          status: Math.random() > 0.7 ? 'warning' : 'normal'
        },
        {
          type: 'traffic',
          label: 'Average Speed',
          value: (Math.random() * 30 + 20).toFixed(1),
          unit: 'km/h',
          status: 'normal'
        },
        {
          type: 'traffic',
          label: 'Lane Occupancy',
          value: (Math.random() * 30 + 45).toFixed(1),
          unit: '%',
          status: Math.random() > 0.8 ? 'warning' : 'normal'
        },
        {
          type: 'traffic',
          label: 'Flow Rate',
          value: Math.floor(Math.random() * 500 + 200),
          unit: 'veh/h',
          status: 'normal'
        }
      )
    }

    // Flood Detection Metrics
    if (scenarios.includes('scenario-002') || cameraName.includes('flood') || cameraName.includes('river') || cameraName.includes('bridge')) {
      generatedMetrics.push(
        {
          type: 'flood',
          label: 'Water Level',
          value: (Math.random() * 0.5 + 0.2).toFixed(2),
          unit: 'meters',
          status: Math.random() > 0.85 ? 'warning' : 'normal'
        },
        {
          type: 'flood',
          label: 'Flooded Area',
          value: Math.floor(Math.random() * 200 + 100),
          unit: 'm²',
          status: 'normal'
        },
        {
          type: 'flood',
          label: 'Submergence Ratio',
          value: (Math.random() * 20 + 10).toFixed(1),
          unit: '%',
          status: Math.random() > 0.9 ? 'critical' : 'normal'
        },
        {
          type: 'flood',
          label: 'Water Flow Rate',
          value: (Math.random() * 2 + 0.5).toFixed(2),
          unit: 'm/s',
          status: 'normal'
        }
      )
    }

    // Crowd Detection Metrics
    if (scenarios.includes('scenario-003') || scenarios.includes('scenario-004') || cameraName.includes('mall') || cameraName.includes('entrance') || cameraName.includes('park')) {
      generatedMetrics.push(
        {
          type: 'crowd',
          label: 'People Count',
          value: Math.floor(Math.random() * 100 + 20),
          unit: 'people',
          status: Math.random() > 0.75 ? 'warning' : 'normal'
        },
        {
          type: 'crowd',
          label: 'Crowd Density',
          value: (Math.random() * 3 + 1).toFixed(2),
          unit: 'people/m²',
          status: Math.random() > 0.8 ? 'warning' : 'normal'
        },
        {
          type: 'crowd',
          label: 'Movement Speed',
          value: (Math.random() * 2 + 0.5).toFixed(2),
          unit: 'm/s',
          status: 'normal'
        },
        {
          type: 'security',
          label: 'Detections (24h)',
          value: Math.floor(Math.random() * 50 + 5),
          unit: 'events',
          status: 'normal'
        }
      )
    }

    // Default metrics jika tidak ada scenario match
    if (generatedMetrics.length === 0) {
      generatedMetrics.push(
        {
          type: 'general',
          label: 'Active Scenarios',
          value: camera.activeScenarios?.length || 0,
          unit: 'scenarios',
          status: 'normal'
        },
        {
          type: 'general',
          label: 'Uptime',
          value: '99.8',
          unit: '%',
          status: 'normal'
        },
        {
          type: 'general',
          label: 'Frame Rate',
          value: camera.specs.fps,
          unit: 'fps',
          status: 'normal'
        }
      )
    }

    // Camera specs metrics
    generatedMetrics.push(
      {
        type: 'specs',
        label: 'Resolution',
        value: camera.specs.resolution,
        status: 'normal'
      },
      {
        type: 'specs',
        label: 'Codec',
        value: camera.specs.codec,
        status: 'normal'
      },
      {
        type: 'specs',
        label: 'Last Update',
        value: new Date(camera.lastSeen).toLocaleTimeString(),
        status: 'normal'
      }
    )

    setMetrics(generatedMetrics)
    
    // Generate historical data for first metric
    if (generatedMetrics.length > 0) {
      const firstMetric = generatedMetrics[0]
      setSelectedMetric(firstMetric.label)
      
      // Generate 24 hours of historical data
      const data = []
      const now = new Date()
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
        const variation = (Math.random() - 0.5) * 0.3
        const baseValue = typeof firstMetric.value === 'number' ? firstMetric.value : 50
        const value = baseValue * (1 + variation)
        
        data.push({
          time: format(timestamp, 'HH:mm'),
          value: Math.max(0, Math.round(value)),
        })
      }
      setHistoricalData(data)
    }
  }, [camera, isOpen])

  const handleViewDetails = () => {
    if (camera) {
      navigate(`/cameras/${camera.id}`)
      onClose()
    }
  }

  if (!camera) return null

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 dark:text-red-400'
      case 'warning': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-green-600 dark:text-green-400'
    }
  }

  const getStatusIndicator = (status?: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} size="xl">
      <DialogTitle>Camera Details: {camera.name}</DialogTitle>
      <DialogBody>
        <div className="space-y-6">
          {/* Camera Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Location</Text>
              <Text className="font-medium">{camera.location.address}</Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">{camera.location.zone}</Text>
            </div>
            <div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Status</Text>
              <Badge color={camera.status === 'online' ? 'green' : 'red'}>{camera.status}</Badge>
            </div>
          </div>

          {/* Historical Chart */}
          {historicalData.length > 0 && (
            <div className="mb-6">
              <Heading level={3} className="mb-4">
                {selectedMetric} - Historical (24h)
              </Heading>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#0066cc" 
                    strokeWidth={2}
                    name={selectedMetric}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Metrics Grid */}
          <div>
            <Heading level={3} className="mb-4">Live Metrics</Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400">{metric.label}</Text>
                    <div className={`h-2 w-2 rounded-full ${getStatusIndicator(metric.status)}`} />
                  </div>
                  <div className={`text-2xl font-semibold ${getStatusColor(metric.status)}`}>
                    {metric.value}
                    {metric.unit && (
                      <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Scenarios */}
          {camera.activeScenarios && camera.activeScenarios.length > 0 && (
            <div>
              <Heading level={3} className="mb-2">Active Scenarios</Heading>
              <div className="flex flex-wrap gap-2">
                {camera.activeScenarios.map((scenarioId) => (
                  <Badge key={scenarioId} color="blue">
                    {scenarioId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={onClose}>Close</Button>
        <Button onClick={handleViewDetails} color="blue">
          View Full Details →
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function CameraFeed({ 
  camera, 
  onClick 
}: { 
  camera: Camera
  onClick: () => void 
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video || camera.status !== 'online') return

    video.muted = true
    video.playsInline = true

    const isHLS = camera.specs.streamUrl.includes('.m3u8')

    const handleLoad = () => {
      setIsPlaying(true)
      setHasError(false)
      video.play().catch(() => {
        // Autoplay blocked, will play on user interaction
        setIsPlaying(false)
      })
    }

    const handleError = () => {
      setHasError(true)
      setIsPlaying(false)
    }

    if (isHLS) {
      // Use HLS.js for M3U8 streams
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        })

        hls.loadSource(camera.specs.streamUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          handleLoad()
        })

        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setHasError(true)
            setIsPlaying(false)
          }
        })

        hlsRef.current = hls
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = camera.specs.streamUrl
        video.addEventListener('loadedmetadata', handleLoad)
      } else {
        setHasError(true)
      }
    } else {
      // Regular MP4 or other formats
      video.src = camera.specs.streamUrl
      video.addEventListener('loadeddata', handleLoad)
    }

    video.addEventListener('error', handleError)
    video.addEventListener('play', () => setIsPlaying(true))
    video.addEventListener('pause', () => setIsPlaying(false))

    return () => {
      video.removeEventListener('loadeddata', handleLoad)
      video.removeEventListener('loadedmetadata', handleLoad)
      video.removeEventListener('error', handleError)
      video.removeEventListener('play', () => setIsPlaying(true))
      video.removeEventListener('pause', () => setIsPlaying(false))
      
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      
      video.pause()
      video.src = ''
    }
  }, [camera.specs.streamUrl, camera.status])

  const handleVideoClick = (e: React.MouseEvent) => {
    // Prevent triggering onClick when clicking video to play/pause
    e.stopPropagation()
    const video = videoRef.current
    if (video && !isPlaying && camera.status === 'online') {
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const handleCardClick = () => {
    onClick()
  }

  return (
    <div 
      className="relative rounded-lg border border-zinc-200 bg-zinc-900 overflow-hidden dark:border-zinc-800 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
      onClick={handleCardClick}
    >
      <div className="aspect-video relative">
        {camera.status === 'online' && !hasError ? (
          <video
            ref={videoRef}
            src={camera.specs.streamUrl}
            className="w-full h-full object-cover"
            playsInline
            muted
            loop
            onClick={handleVideoClick}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <div className="text-center text-zinc-400">
              {hasError ? (
                <>
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Stream unavailable</p>
                </>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h4a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H10a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Camera offline</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Loading indicator */}
        {camera.status === 'online' && !isPlaying && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Metadata overlay */}
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-mono">
          {camera.id} {isPlaying && '● LIVE'}
        </div>

            {/* Click hint */}
            <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs flex items-center gap-1">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Details
            </div>

            {/* Snapshot button */}
            <div className="absolute bottom-2 right-2">
              <Button
                className="bg-black/70 hover:bg-black/80 text-white border-0 text-xs px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation()
                  // Mock snapshot functionality
                  const canvas = document.createElement('canvas')
                  const ctx = canvas.getContext('2d')
                  canvas.width = 400
                  canvas.height = 300
                  if (ctx) {
                    ctx.fillStyle = '#1f2937'
                    ctx.fillRect(0, 0, 400, 300)
                    ctx.fillStyle = '#ffffff'
                    ctx.font = '16px Arial'
                    ctx.textAlign = 'center'
                    ctx.fillText('Camera Snapshot', 200, 150)
                    ctx.fillText(camera.name, 200, 180)
                    ctx.fillText(new Date().toLocaleString(), 200, 210)
                  }
                  
                  const link = document.createElement('a')
                  link.download = `snapshot-${camera.id}-${Date.now()}.png`
                  link.href = canvas.toDataURL()
                  link.click()
                }}
              >
                📸 Snapshot
              </Button>
            </div>
      </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-4 py-2 flex items-center justify-between">
            <span className="text-white text-sm font-medium">{camera.name}</span>
            <div className="flex items-center gap-2">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white border-0 text-xs px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation()
                  // Mock recording functionality
                  alert(`Started recording from ${camera.name}`)
                }}
              >
                🔴 REC
              </Button>
              <Badge color={camera.status === 'online' ? 'green' : 'red'}>{camera.status}</Badge>
            </div>
          </div>
    </div>
  )
}

export function CamerasPage() {
  const [gridSize, setGridSize] = useState<'1x1' | '2x2' | '4x4'>('2x2')
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [showMetricsDialog, setShowMetricsDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Realtime data streaming - data mengalir tanpa reload
  const realtimeData = useRealtimeData()
  
  const { data: cameras, isLoading } = useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraApi.getAll(),
    initialData: realtimeData.cameras,
  })
  
  // Use realtime cameras for display
  const displayCameras = realtimeData.cameras || cameras

  const handleCameraClick = (camera: Camera) => {
    setSelectedCamera(camera)
    setShowMetricsDialog(true)
  }

  // Filter cameras based on selected filters
  const filteredCameras = displayCameras?.filter(camera => {
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter
    const matchesType = typeFilter === 'all' || camera.activeScenarios?.some(scenario => 
      scenario.toLowerCase().includes(typeFilter.toLowerCase())
    ) || camera.name.toLowerCase().includes(typeFilter.toLowerCase())
    const matchesSearch = searchQuery === '' || 
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  }) || []

  // Get unique camera types for filter
  const cameraTypes = Array.from(new Set(
    displayCameras?.flatMap(camera => 
      camera.activeScenarios?.map(scenario => {
        if (scenario.includes('traffic')) return 'Traffic'
        if (scenario.includes('flood')) return 'Flood'
        if (scenario.includes('crowd')) return 'Crowd'
        if (scenario.includes('security')) return 'Security'
        if (scenario.includes('intrusion')) return 'Intrusion'
        return 'Other'
      }) || []
    ) || []
  )).sort()

  const gridCols = {
    '1x1': 'grid-cols-1',
    '2x2': 'grid-cols-1 sm:grid-cols-2',
    '4x4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Heading className="text-2xl font-bold text-gray-900 dark:text-white">
                    Live Camera View
                  </Heading>
                  <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                    Monitor all cameras in real-time
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    plain 
                    onClick={() => setGridSize('1x1')}
                    className={`${gridSize === '1x1' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-lg font-medium transition-colors`}
                  >
                    1x1
                  </Button>
                  <Button 
                    plain 
                    onClick={() => setGridSize('2x2')}
                    className={`${gridSize === '2x2' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-lg font-medium transition-colors`}
                  >
                    2x2
                  </Button>
                  <Button 
                    plain 
                    onClick={() => setGridSize('4x4')}
                    className={`${gridSize === '4x4' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'} px-4 py-2 rounded-lg font-medium transition-colors`}
                  >
                    4x4
                  </Button>
                </div>
              </div>
              
              {/* Filters and Search */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search cameras by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'all' | 'online' | 'offline')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Status</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="all">All Types</option>
                    {cameraTypes.map(type => (
                      <option key={type} value={type.toLowerCase()}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Camera Grid */}
          {isLoading ? (
            <LoadingState message="Loading cameras..." />
          ) : filteredCameras.length > 0 ? (
            <div className={`grid ${gridCols[gridSize]} gap-6`}>
              {filteredCameras.map((camera) => (
                <CameraFeed
                  key={camera.id}
                  camera={camera}
                  onClick={() => handleCameraClick(camera)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No cameras found matching your filters
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                Try adjusting your search or filter criteria
              </div>
            </div>
          )}

          {/* Camera List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2} className="text-xl font-bold text-gray-900 dark:text-white">
                Camera Status
              </Heading>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {filteredCameras.length} of {cameras?.length || 0} cameras
              </div>
            </div>
            <div className="space-y-3">
              {filteredCameras.map((camera) => (
                <div
                  key={camera.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-3 w-3 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white">{camera.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {camera.location.address}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {camera.activeScenarios?.map(scenario => {
                          if (scenario.includes('traffic')) return 'Traffic'
                          if (scenario.includes('flood')) return 'Flood'
                          if (scenario.includes('crowd')) return 'Crowd'
                          if (scenario.includes('security')) return 'Security'
                          if (scenario.includes('intrusion')) return 'Intrusion'
                          return 'Other'
                        }).join(', ') || 'No scenarios'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge color={camera.status === 'online' ? 'green' : 'red'}>
                      {camera.status}
                    </Badge>
                    <Button
                      plain
                      onClick={() => handleCameraClick(camera)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Metrics Dialog */}
      <CameraMetricsDialog
        camera={selectedCamera}
        isOpen={showMetricsDialog}
        onClose={() => {
          setShowMetricsDialog(false)
          setSelectedCamera(null)
        }}
      />
    </div>
  )
}

