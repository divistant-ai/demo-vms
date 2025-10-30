export type DetectionType =
  | 'object_detection'
  | 'traffic_monitoring'
  | 'flood_detection'
  | 'crowd_detection'
  | 'fire_detection'
  | 'loitering'
  | 'intrusion'
  | 'abandoned_object'
  | 'wrong_way'
  | 'parking_violation'

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

export type IncidentStatus = 'open' | 'acknowledged' | 'assigned' | 'in_progress' | 'closed'

export type Annotation = {
  id: string
  type: string
  coordinates: Array<number>
  label: string
}

export type Comment = {
  id: string
  author: string
  text: string
  timestamp: Date
}

export type ActionLog = {
  action: string
  by: string
  to?: string
  description?: string
  timestamp: Date
}

export type IncidentEvidence = {
  snapshot: string
  videoClip?: string
  annotations: Array<Annotation>
}

export type Incident = {
  id: string
  type: DetectionType
  severity: IncidentSeverity
  timestamp: Date
  location: string
  cameraId: string
  description: string
  status: IncidentStatus
  assignedTo?: string
  metrics: Record<string, number | string>
  evidence: IncidentEvidence
  comments: Array<Comment>
  actionHistory: Array<ActionLog>
}


