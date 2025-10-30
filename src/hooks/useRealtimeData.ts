import { useEffect, useState } from 'react'
import { realtimeDataService } from '../services/realtime/realtimeDataService'
import type { Camera } from '../types/camera'
import type { Incident } from '../types/incident'

type RealtimeData = {
  cameras: Array<Camera>
  incidents: Array<Incident>
  analytics: {
    overview: {
      total_incidents_24h: number
      total_incidents_7d: number
      active_cameras: number
      offline_cameras: number
      avg_response_time_minutes: number
      system_uptime_percent: number
    }
    timeSeries: Array<{
      timestamp: Date
      traffic_incidents: number
      flood_alerts: number
      intrusions: number
      total: number
    }>
  }
}

export function useRealtimeData() {
  const [data, setData] = useState<RealtimeData>({
    cameras: realtimeDataService.getCameras(),
    incidents: realtimeDataService.getIncidents(),
    analytics: {
      overview: realtimeDataService.getAnalyticsOverview(),
      timeSeries: realtimeDataService.getTimeSeriesData()
    }
  })

  useEffect(() => {
    // Start realtime service
    realtimeDataService.start()

    // Subscribe to updates - data mengalir tanpa reload
    const unsubscribe = realtimeDataService.subscribe((type, newData) => {
      setData((prev) => {
        if (type === 'camera') {
          return { ...prev, cameras: newData as Array<Camera> }
        } else if (type === 'incident') {
          return { ...prev, incidents: newData as Array<Incident> }
        } else if (type === 'analytics') {
          return { ...prev, analytics: newData as RealtimeData['analytics'] }
        }
        return prev
      })
    })

    // Cleanup
    return () => {
      unsubscribe()
    }
  }, [])

  return data
}

