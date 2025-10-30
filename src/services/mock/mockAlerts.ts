import type { Alert } from '../../types/alert'

export const mockAlerts: Array<Alert> = [
  {
    id: 'alert-001',
    incidentId: 'inc-001',
    type: 'traffic_congestion',
    severity: 'high',
    timestamp: new Date(Date.now() - 1800000),
    message: 'Traffic congestion detected at Downtown Intersection',
    cameraId: 'cam-001',
    acknowledged: true,
    acknowledgedBy: 'manager-001',
    acknowledgedAt: new Date(Date.now() - 1750000),
    notificationChannels: ['in-app', 'email'],
  },
  {
    id: 'alert-002',
    incidentId: 'inc-002',
    type: 'flood',
    severity: 'critical',
    timestamp: new Date(Date.now() - 3600000),
    message: 'Flood level critical at River Bridge',
    cameraId: 'cam-002',
    acknowledged: false,
    notificationChannels: ['in-app', 'email', 'sms'],
  },
  {
    id: 'alert-003',
    incidentId: 'inc-003',
    type: 'intrusion',
    severity: 'medium',
    timestamp: new Date(Date.now() - 900000),
    message: 'Unauthorized entry detected at Shopping Mall Entrance',
    cameraId: 'cam-004',
    acknowledged: false,
    notificationChannels: ['in-app'],
  },
]

