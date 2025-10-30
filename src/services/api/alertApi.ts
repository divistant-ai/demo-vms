import type { Alert } from '../../types/alert'
import { mockAlerts } from '../mock/mockAlerts'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const alertApi = {
  getAll: async (): Promise<Array<Alert>> => {
    await delay(300)
    return [...mockAlerts]
  },

  getById: async (id: string): Promise<Alert | null> => {
    await delay(200)
    return mockAlerts.find((alert) => alert.id === id) || null
  },

  acknowledge: async (id: string, userId: string): Promise<Alert | null> => {
    await delay(300)
    const alert = mockAlerts.find((a) => a.id === id)
    if (!alert) return null
    alert.acknowledged = true
    alert.acknowledgedBy = userId
    alert.acknowledgedAt = new Date()
    return alert
  },
}

