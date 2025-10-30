export type AlertType =
  | 'traffic_congestion'
  | 'flood'
  | 'intrusion'
  | 'fire'
  | 'crowd'
  | 'object_detection'
  | 'parking_violation'

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'webhook'

export type Alert = {
  id: string
  incidentId: string
  type: AlertType
  severity: AlertSeverity
  timestamp: Date
  message: string
  cameraId: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: Date
  notificationChannels: Array<NotificationChannel>
}


