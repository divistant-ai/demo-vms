export type CameraStatus = 'online' | 'offline' | 'error'

export type CameraLocation = {
  lat: number
  lng: number
  address: string
  zone: string
}

export type CameraSpecs = {
  resolution: string
  fps: number
  codec: string
  streamUrl: string
}

export type Camera = {
  id: string
  name: string
  location: CameraLocation
  specs: CameraSpecs
  status: CameraStatus
  lastSeen: Date
  activeScenarios: Array<string>
  metadata: Record<string, any>
}


