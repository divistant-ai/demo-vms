import type { AnalyticsOverview, TimeSeriesData, DistributionData, HeatmapPoint } from '../../types/analytics'

export const mockAnalyticsOverview: AnalyticsOverview = {
  total_incidents_24h: 47,
  total_incidents_7d: 312,
  active_cameras: 18,
  offline_cameras: 2,
  avg_response_time_minutes: 4.2,
  system_uptime_percent: 99.8,
}

export const mockTimeSeriesData: Array<TimeSeriesData> = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - (23 - i) * 3600000),
  traffic_incidents: Math.floor(Math.random() * 50) + 10,
  flood_alerts: Math.floor(Math.random() * 5),
  intrusions: Math.floor(Math.random() * 10) + 2,
  total: 0,
})).map((item) => ({
  ...item,
  total: item.traffic_incidents + item.flood_alerts + item.intrusions,
}))

export const mockDistributionData: DistributionData = {
  traffic_congestion: 60,
  flood_detection: 5,
  intrusion: 15,
  crowd_detection: 12,
  other: 8,
}

export const mockHeatmapData: Array<HeatmapPoint> = [
  {
    location: 'Downtown Intersection',
    lat: -6.195,
    lng: 106.816,
    intensity: 0.95,
  },
  {
    location: 'River Bridge',
    lat: -6.200,
    lng: 106.820,
    intensity: 0.65,
  },
  {
    location: 'Traffic Junction Plaza',
    lat: -6.190,
    lng: 106.810,
    intensity: 0.75,
  },
  {
    location: 'Shopping Mall Entrance',
    lat: -6.205,
    lng: 106.825,
    intensity: 0.45,
  },
  {
    location: 'Park Perimeter North',
    lat: -6.185,
    lng: 106.815,
    intensity: 0.35,
  },
]

