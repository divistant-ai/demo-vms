import type { Alert } from '../../types/alert'

class MockWebSocket {
  private listeners: Record<string, Array<(data: unknown) => void>> = {}
  private intervalId: number | null = null
  private isConnected = false

  constructor(_url: string) {
    // Simulate connection after delay
    setTimeout(() => {
      this.isConnected = true
      this.startSimulation()
      this.emit('open', {})
    }, 500)
  }

  private startSimulation() {
    // Simulate real-time alert events every 5-10 seconds
    this.intervalId = window.setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of alert
        const alert = this.generateRandomAlert()
        this.emit('message', { data: JSON.stringify(alert) })
      }
    }, 5000 + Math.random() * 5000)
  }

  private generateRandomAlert(): Alert {
    const types: Array<Alert['type']> = ['traffic_congestion', 'flood', 'intrusion', 'crowd']
    const severities: Array<Alert['severity']> = ['low', 'medium', 'high', 'critical']
    const cameras = ['cam-001', 'cam-002', 'cam-003', 'cam-004', 'cam-005']
    
    return {
      id: `alert-${Date.now()}`,
      incidentId: `inc-${Date.now()}`,
      type: types[Math.floor(Math.random() * types.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(),
      message: `${types[Math.floor(Math.random() * types.length)].replace('_', ' ')} detected`,
      cameraId: cameras[Math.floor(Math.random() * cameras.length)],
      acknowledged: false,
      notificationChannels: ['in-app'],
    }
  }

  private emit(event: string, data: unknown) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((listener) => listener(data))
    }
  }

  addEventListener(event: string, handler: (data: unknown) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(handler)
  }

  removeEventListener(event: string, handler: (data: unknown) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((h) => h !== handler)
    }
  }

  close() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
    }
    this.isConnected = false
    this.emit('close', {})
  }

  get readyState() {
    return this.isConnected ? 1 : 0 // OPEN = 1, CONNECTING = 0
  }
}

export const createMockWebSocket = (_onMessage?: (data: unknown) => void): MockWebSocket => {
  return new MockWebSocket('')
}

export { MockWebSocket }

