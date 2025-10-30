import { mockCameras } from '../mock/mockCameras'
import { mockIncidents } from '../mock/mockIncidents'
import { mockAnalyticsOverview, mockTimeSeriesData } from '../mock/mockAnalytics'

type DataUpdateCallback = (type: 'camera' | 'incident' | 'analytics', data: unknown) => void

class RealtimeDataService {
  private dataCallbacks: Set<DataUpdateCallback> = new Set()
  private intervalId: number | null = null
  private isRunning = false

  start(): void {
    if (this.isRunning) return
    
    this.isRunning = true
    this.intervalId = window.setInterval(() => {
      this.updateCameraData()
      this.updateIncidentData()
      this.updateAnalyticsData()
    }, 2000) // Update setiap 2 detik untuk lebih smooth
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
  }

  subscribe(callback: DataUpdateCallback): () => void {
    this.dataCallbacks.add(callback)
    return () => {
      this.dataCallbacks.delete(callback)
    }
  }

  private notifyDataUpdate(type: 'camera' | 'incident' | 'analytics', data: unknown): void {
    this.dataCallbacks.forEach((callback) => callback(type, data))
  }

  // Get current data snapshots
  getCameras() {
    return [...mockCameras]
  }

  getIncidents() {
    return [...mockIncidents]
  }

  getAnalyticsOverview() {
    return { ...mockAnalyticsOverview }
  }

  getTimeSeriesData() {
    return [...mockTimeSeriesData]
  }

  private updateCameraData(): void {
    let hasChanges = false
    
    mockCameras.forEach((camera) => {
      // Update lastSeen untuk semua kamera online
      if (camera.status === 'online') {
        camera.lastSeen = new Date()
        hasChanges = true
      }

      // Simulasi perubahan status kamera secara random (1% chance)
      if (Math.random() < 0.01) {
        camera.status = camera.status === 'online' ? 'offline' : 'online'
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      this.notifyDataUpdate('camera', this.getCameras())
    }
  }

  private updateIncidentData(): void {
    let hasChanges = false
    
    // Update timestamp incidents yang masih active
    mockIncidents.forEach((incident) => {
      if (incident.status === 'in_progress' || incident.status === 'acknowledged') {
        // Simulasi progress (5% chance untuk update status)
        if (Math.random() < 0.05) {
          if (incident.status === 'acknowledged') {
            incident.status = 'in_progress'
            hasChanges = true
          } else if (Math.random() < 0.3) {
            incident.status = 'resolved'
            hasChanges = true
          }
        }
      }
    })

    // Tambah incident baru secara random (2% chance)
    if (Math.random() < 0.02) {
      const types: Array<'traffic_monitoring' | 'flood_detection' | 'intrusion' | 'crowd_detection'> = ['traffic_monitoring', 'flood_detection', 'intrusion', 'crowd_detection']
      const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical']
      const statuses: Array<'open' | 'acknowledged'> = ['open', 'acknowledged']
      
      const newIncident = {
        id: `inc-${String(mockIncidents.length + 1).padStart(3, '0')}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: new Date(),
        location: mockCameras[Math.floor(Math.random() * mockCameras.length)].location.address,
        cameraId: mockCameras[Math.floor(Math.random() * mockCameras.length)].id,
        description: 'New incident detected by AI system',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        assignedTo: `officer-${String(Math.floor(Math.random() * 5) + 1).padStart(3, '0')}`,
        metrics: {
          confidence: Math.random() * 0.3 + 0.7,
        },
        evidence: {
          snapshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#1a1a2e"/><text x="320" y="240" fill="white" text-anchor="middle">New Incident</text></svg>',
          annotations: [],
        },
        comments: [],
        actionHistory: [
          {
            action: 'opened',
            by: 'system',
            timestamp: new Date(),
          },
        ],
      }
      
      mockIncidents.unshift(newIncident)
      hasChanges = true
      
      // Batasi jumlah incidents maksimal 100
      if (mockIncidents.length > 100) {
        mockIncidents.pop()
      }
    }
    
    if (hasChanges) {
      this.notifyDataUpdate('incident', this.getIncidents())
    }
  }

  private updateAnalyticsData(): void {
    // Update analytics overview dengan variasi random
    const variation = (base: number, range: number) => 
      Math.max(0, base + Math.floor(Math.random() * range * 2 - range))

    mockAnalyticsOverview.total_incidents_24h = variation(47, 5)
    mockAnalyticsOverview.total_incidents_7d = variation(312, 20)
    mockAnalyticsOverview.active_cameras = mockCameras.filter(c => c.status === 'online').length
    mockAnalyticsOverview.offline_cameras = mockCameras.filter(c => c.status === 'offline').length
    mockAnalyticsOverview.avg_response_time_minutes = Math.max(1, 4.2 + (Math.random() - 0.5) * 2)
    mockAnalyticsOverview.system_uptime_percent = Math.max(95, Math.min(100, 99.8 + (Math.random() - 0.5) * 0.5))

    // Update time series data - update values dan timestamp secara realtime
    const now = new Date()
    
    mockTimeSeriesData.forEach((dataPoint, index) => {
      // Update timestamp - setiap data point maju 2 detik setiap update
      // Ini membuat chart terlihat seperti time-lapse yang terus berjalan
      const baseTime = now.getTime() - ((mockTimeSeriesData.length - index - 1) * 3600000) // Spacing 1 jam
      dataPoint.timestamp = new Date(baseTime)
      
      // Update data point dengan variasi kecil untuk simulasi realtime
      const variation = Math.floor(Math.random() * 5) - 2 // -2 to +2
      
      dataPoint.traffic_incidents = Math.max(5, dataPoint.traffic_incidents + variation)
      dataPoint.flood_alerts = Math.max(0, dataPoint.flood_alerts + (Math.random() > 0.7 ? 1 : 0))
      dataPoint.intrusions = Math.max(0, dataPoint.intrusions + (Math.random() > 0.8 ? 1 : 0))
      dataPoint.total = dataPoint.traffic_incidents + dataPoint.flood_alerts + dataPoint.intrusions
    })
    
    // Tambah data point baru setiap 5 update cycles (10 detik)
    const latestData = mockTimeSeriesData[mockTimeSeriesData.length - 1]
    
    if (!latestData._lastAddTime || now.getTime() - latestData._lastAddTime > 10000) {
      mockTimeSeriesData.shift() // Hapus data paling lama
      
      const newDataPoint = {
        timestamp: now,
        traffic_incidents: Math.floor(Math.random() * 50) + 10,
        flood_alerts: Math.floor(Math.random() * 5),
        intrusions: Math.floor(Math.random() * 10) + 2,
        total: 0,
        _lastAddTime: now.getTime(),
      }
      newDataPoint.total = newDataPoint.traffic_incidents + newDataPoint.flood_alerts + newDataPoint.intrusions
      
      mockTimeSeriesData.push(newDataPoint)
    }
    
    // Notify analytics update
    this.notifyDataUpdate('analytics', {
      overview: this.getAnalyticsOverview(),
      timeSeries: this.getTimeSeriesData()
    })
  }
}

export const realtimeDataService = new RealtimeDataService()

