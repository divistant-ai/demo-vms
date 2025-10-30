import type { Incident } from '../../types/incident'
import { mockIncidents } from '../mock/mockIncidents'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const incidentApi = {
  getAll: async (filters?: {
    dateFrom?: Date
    dateTo?: Date
    type?: string
    status?: string
    severity?: string
  }): Promise<Array<Incident>> => {
    await delay(400)
    let filtered = [...mockIncidents]
    
    if (filters?.dateFrom) {
      filtered = filtered.filter((inc) => inc.timestamp >= filters.dateFrom!)
    }
    if (filters?.dateTo) {
      filtered = filtered.filter((inc) => inc.timestamp <= filters.dateTo!)
    }
    if (filters?.type) {
      filtered = filtered.filter((inc) => inc.type === filters.type)
    }
    if (filters?.status) {
      filtered = filtered.filter((inc) => inc.status === filters.status)
    }
    if (filters?.severity) {
      filtered = filtered.filter((inc) => inc.severity === filters.severity)
    }
    
    return filtered
  },

  getById: async (id: string): Promise<Incident | null> => {
    await delay(200)
    return mockIncidents.find((inc) => inc.id === id) || null
  },

  update: async (id: string, updates: Partial<Incident>): Promise<Incident | null> => {
    await delay(300)
    const index = mockIncidents.findIndex((inc) => inc.id === id)
    if (index === -1) return null
    mockIncidents[index] = { ...mockIncidents[index], ...updates }
    return mockIncidents[index]
  },
}

