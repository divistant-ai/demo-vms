import type { Incident } from '../../types/incident'

export const mockIncidents: Array<Incident> = [
  {
    id: 'inc-001',
    type: 'traffic_monitoring',
    severity: 'high',
    timestamp: new Date(Date.now() - 1800000),
    location: 'Downtown Intersection Main St',
    cameraId: 'cam-001',
    description: 'Heavy traffic congestion detected at main intersection',
    status: 'acknowledged',
    assignedTo: 'officer-001',
    metrics: {
      vehicleCount: 150,
      avgSpeed: 5,
      occupancy: 95,
      confidence: 0.92,
    },
    evidence: {
      snapshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#1a1a2e"/><text x="320" y="240" fill="white" text-anchor="middle">Traffic Congestion</text></svg>',
      videoClip: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
      annotations: [],
    },
    comments: [
      {
        id: 'comment-001',
        author: 'officer-001',
        text: 'Investigating cause',
        timestamp: new Date(Date.now() - 1700000),
      },
    ],
    actionHistory: [
      {
        action: 'acknowledged',
        by: 'manager-001',
        timestamp: new Date(Date.now() - 1750000),
      },
    ],
  },
  {
    id: 'inc-002',
    type: 'flood_detection',
    severity: 'critical',
    timestamp: new Date(Date.now() - 3600000),
    location: 'River Bridge',
    cameraId: 'cam-002',
    description: 'Flood level rising above warning threshold',
    status: 'in_progress',
    assignedTo: 'officer-002',
    metrics: {
      waterLevel: 1.2,
      area: 500,
      submergenceRatio: 0.85,
      confidence: 0.97,
    },
    evidence: {
      snapshot: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="640" height="480" fill="#0066cc"/><text x="320" y="240" fill="white" text-anchor="middle">Flood Detection</text></svg>',
      videoClip: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      annotations: [],
    },
    comments: [],
    actionHistory: [
      {
        action: 'opened',
        by: 'system',
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        action: 'assigned',
        by: 'manager-001',
        to: 'officer-002',
        timestamp: new Date(Date.now() - 3300000),
      },
    ],
  },
]

