import type { Camera } from '../../types/camera'
import { mockCameras } from '../mock/mockCameras'

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const cameraApi = {
  getAll: async (): Promise<Array<Camera>> => {
    await delay(300)
    return mockCameras
  },

  getById: async (id: string): Promise<Camera | null> => {
    await delay(200)
    return mockCameras.find((cam) => cam.id === id) || null
  },

  create: async (camera: Omit<Camera, 'id' | 'lastSeen'>): Promise<Camera> => {
    await delay(400)
    const newCamera: Camera = {
      ...camera,
      id: `cam-${String(mockCameras.length + 1).padStart(3, '0')}`,
      lastSeen: new Date(),
    }
    mockCameras.push(newCamera)
    return newCamera
  },

  update: async (id: string, updates: Partial<Camera>): Promise<Camera | null> => {
    await delay(300)
    const index = mockCameras.findIndex((cam) => cam.id === id)
    if (index === -1) return null
    mockCameras[index] = { ...mockCameras[index], ...updates }
    return mockCameras[index]
  },

  delete: async (id: string): Promise<boolean> => {
    await delay(300)
    const index = mockCameras.findIndex((cam) => cam.id === id)
    if (index === -1) return false
    mockCameras.splice(index, 1)
    return true
  },
}

