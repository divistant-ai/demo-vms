import type { DetectionType } from './incident'

export type Zone = {
  id: string
  name: string
  coordinates: Array<Array<number>>
}

export type ScenarioParameters = {
  sensitivity: number
  threshold: number
  cooldownPeriod: number
  minConfidence: number
}

export type ScenarioPerformance = {
  precision: number
  recall: number
  f1Score: number
  falsePositiveRate: number
}

export type DetectionScenario = {
  id: string
  name: string
  description: string
  enabled: boolean
  type: DetectionType
  parameters: ScenarioParameters
  zones: Array<Zone>
  assignedCameras: Array<string>
  alertRecipients: Array<string>
  performance: ScenarioPerformance
  createdAt: Date
  updatedAt: Date
}

