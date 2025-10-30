export type AnalyticsData = {
  timestamp: Date
  cameraId: string
  scenarioId: string
  detectionCount: number
  uniqueObjects: number
  avgConfidence: number
  metrics: Record<string, number>
}

export type AnalyticsOverview = {
  total_incidents_24h: number
  total_incidents_7d: number
  active_cameras: number
  offline_cameras: number
  avg_response_time_minutes: number
  system_uptime_percent: number
}

export type TimeSeriesData = {
  timestamp: Date
  traffic_incidents: number
  flood_alerts: number
  intrusions: number
  total: number
  _lastAddTime?: number
}

export type DistributionData = {
  traffic_congestion: number
  flood_detection: number
  intrusion: number
  crowd_detection: number
  other: number
}

export type HeatmapPoint = {
  location: string
  lat: number
  lng: number
  intensity: number
}



