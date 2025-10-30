import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Text } from '../components/catalyst/text'
import { cameraApi } from '../services/api/cameraApi'
import { LoadingState, EmptyState } from '../utils/loadingStates'
import { format } from 'date-fns'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface HistoricalData {
  timestamp: string
  value: number
  label: string
}

export function CameraDetailPage() {
  const { cameraId } = useParams<{ cameraId: string }>()
  const navigate = useNavigate()
  const [selectedMetric, setSelectedMetric] = useState<string>('vehicleCount')
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const { data: camera, isLoading, error } = useQuery({
    queryKey: ['camera', cameraId],
    queryFn: () => cameraApi.getById(cameraId!),
    enabled: !!cameraId,
  })

  // Generate historical data for charts
  const generateHistoricalData = (metricName: string, count: number = 24): HistoricalData[] => {
    const data: HistoricalData[] = []
    const now = new Date()
    
    const baseValues: Record<string, number> = {
      vehicleCount: 100,
      avgSpeed: 30,
      occupancy: 60,
      flowRate: 400,
      waterLevel: 0.5,
      floodedArea: 150,
      peopleCount: 50,
      crowdDensity: 2.0,
    }

    const baseValue = baseValues[metricName] || 50

    for (let i = count - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
      const variation = (Math.random() - 0.5) * 0.3 // ±15% variation
      const value = baseValue * (1 + variation)
      
      data.push({
        timestamp: format(timestamp, 'HH:mm'),
        value: Math.max(0, Math.round(value)),
        label: metricName,
      })
    }
    return data
  }

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])

  useEffect(() => {
    if (selectedMetric) {
      setHistoricalData(generateHistoricalData(selectedMetric))
    }
  }, [selectedMetric])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !camera || camera.status !== 'online') return

    video.muted = true
    video.playsInline = true

    const isHLS = camera.specs.streamUrl.includes('.m3u8')

    if (isHLS) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        })

        hls.loadSource(camera.specs.streamUrl)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().then(() => setIsPlaying(true)).catch(() => {})
        })

        hlsRef.current = hls
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = camera.specs.streamUrl
        video.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    } else {
      video.src = camera.specs.streamUrl
      video.play().then(() => setIsPlaying(true)).catch(() => {})
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      video.pause()
      video.src = ''
    }
  }, [camera])

  if (isLoading) {
    return <LoadingState message={`Loading camera ${cameraId}...`} />
  }

  if (error) {
    return <EmptyState title="Error loading camera" message="There was an error loading the camera details. Please try again." />
  }

  if (!camera) {
    return <EmptyState title="Camera not found" message={`No camera found with ID: ${cameraId}`} />
  }

  const cameraName = camera.name.toLowerCase()
  const scenarios = camera.activeScenarios || []
  
  const metrics = []
  
  if (scenarios.includes('scenario-001') || cameraName.includes('traffic') || cameraName.includes('junction') || cameraName.includes('intersection')) {
    metrics.push(
      { key: 'vehicleCount', label: 'Vehicle Count', current: Math.floor(Math.random() * 200) + 50 },
      { key: 'avgSpeed', label: 'Average Speed', current: (Math.random() * 30 + 20).toFixed(1), unit: 'km/h' },
      { key: 'occupancy', label: 'Lane Occupancy', current: (Math.random() * 30 + 45).toFixed(1), unit: '%' },
      { key: 'flowRate', label: 'Flow Rate', current: Math.floor(Math.random() * 500 + 200), unit: 'veh/h' }
    )
  } else if (scenarios.includes('scenario-002') || cameraName.includes('flood') || cameraName.includes('river') || cameraName.includes('bridge')) {
    metrics.push(
      { key: 'waterLevel', label: 'Water Level', current: (Math.random() * 0.5 + 0.2).toFixed(2), unit: 'meters' },
      { key: 'floodedArea', label: 'Flooded Area', current: Math.floor(Math.random() * 200 + 100), unit: 'm²' },
      { key: 'submergenceRatio', label: 'Submergence Ratio', current: (Math.random() * 20 + 10).toFixed(1), unit: '%' },
      { key: 'waterFlowRate', label: 'Water Flow Rate', current: (Math.random() * 2 + 0.5).toFixed(2), unit: 'm/s' }
    )
  } else {
    metrics.push(
      { key: 'peopleCount', label: 'People Count', current: Math.floor(Math.random() * 100 + 20) },
      { key: 'crowdDensity', label: 'Crowd Density', current: (Math.random() * 3 + 1).toFixed(2), unit: 'people/m²' },
      { key: 'movementSpeed', label: 'Movement Speed', current: (Math.random() * 2 + 0.5).toFixed(2), unit: 'm/s' },
      { key: 'detections', label: 'Detections (24h)', current: Math.floor(Math.random() * 50 + 5), unit: 'events' }
    )
  }

  if (metrics.length === 0) {
    metrics.push({ key: 'general', label: 'General', current: 'N/A' })
  }

  const selectedMetricData = metrics.find(m => m.key === selectedMetric) || metrics[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button plain onClick={() => navigate('/cameras')}>
            ← Back to Cameras
          </Button>
          <Heading className="mt-2">{camera.name}</Heading>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">
            {camera.location.address} • {camera.location.zone}
          </Text>
        </div>
        <Badge color={camera.status === 'online' ? 'green' : 'red'}>{camera.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Stream */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-zinc-900 overflow-hidden dark:border-zinc-800">
            <div className="aspect-video relative">
              {camera.status === 'online' ? (
                <video
                  ref={videoRef}
                  src={camera.specs.streamUrl}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  loop
                  controls
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                  <Text className="text-zinc-400">Camera offline</Text>
                </div>
              )}
              {isPlaying && (
                <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-mono">
                  ● LIVE
                </div>
              )}
            </div>
          </div>

          {/* Historical Chart */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3}>
                {selectedMetricData.label} - Historical (24h)
              </Heading>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              >
                {metrics.map((metric) => (
                  <option key={metric.key} value={metric.key}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0066cc" 
                  strokeWidth={2}
                  name={selectedMetricData.label}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Metrics */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={3} className="mb-4">Current Metrics</Heading>
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.key} className="flex items-center justify-between">
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400">{metric.label}</Text>
                  <div className="text-right">
                    <Text className="font-semibold text-zinc-950 dark:text-white">
                      {metric.current}
                      {metric.unit && (
                        <span className="text-sm font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                          {metric.unit}
                        </span>
                      )}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Camera Info */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={3} className="mb-4">Camera Information</Heading>
            <div className="space-y-3">
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Camera ID</Text>
                <Text className="font-medium">{camera.id}</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Resolution</Text>
                <Text className="font-medium">{camera.specs.resolution}</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Frame Rate</Text>
                <Text className="font-medium">{camera.specs.fps} fps</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Codec</Text>
                <Text className="font-medium">{camera.specs.codec}</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Last Seen</Text>
                <Text className="font-medium">
                  {format(new Date(camera.lastSeen), 'MMM dd, yyyy HH:mm:ss')}
                </Text>
              </div>
            </div>
          </div>

          {/* Active Scenarios */}
          {camera.activeScenarios && camera.activeScenarios.length > 0 && (
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <Heading level={3} className="mb-4">Active Scenarios</Heading>
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
      </div>
    </div>
  )
}
