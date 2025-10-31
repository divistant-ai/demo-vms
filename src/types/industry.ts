/**
 * Industry Profile Types
 * Defines various industry verticals and their specific configurations
 */

export type IndustryType = 
  | 'personal'
  | 'retail'
  | 'logistics'
  | 'manufacturing'
  | 'smart_city'
  | 'transportation'
  | 'healthcare'
  | 'education'
  | 'hospitality'
  | 'construction'
  | 'agriculture'
  | 'energy'

export type UseCase = 
  | 'security_surveillance'
  | 'traffic_monitoring'
  | 'crowd_management'
  | 'perimeter_security'
  | 'vehicle_tracking'
  | 'package_tracking'
  | 'quality_control'
  | 'safety_compliance'
  | 'access_control'
  | 'parking_management'
  | 'waste_management'
  | 'environmental_monitoring'
  | 'asset_tracking'
  | 'people_counting'
  | 'queue_management'
  | 'license_plate_recognition'
  | 'facial_recognition'
  | 'fire_detection'
  | 'flood_detection'
  | 'intrusion_detection'

export type IndustryProfile = {
  id: string
  type: IndustryType
  name: string
  description: string
  icon: string
  useCases: UseCase[]
  recommendedFeatures: string[]
  dashboardLayout: DashboardLayout
  defaultScenarios: ScenarioPreset[]
  kpiMetrics: KPIMetric[]
  integrations: string[]
  complianceRequirements?: string[]
}

export type DashboardLayout = {
  widgets: DashboardWidget[]
  defaultView: 'grid' | 'list' | 'map'
  refreshInterval: number
  chartTypes: string[]
}

export type DashboardWidget = {
  id: string
  type: 'metric' | 'chart' | 'map' | 'table' | 'alert' | 'camera_grid'
  title: string
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number }
  dataSource: string
  config: Record<string, unknown>
}

export type ScenarioPreset = {
  id: string
  name: string
  description: string
  detectionType: string
  zones: string[]
  sensitivity: 'low' | 'medium' | 'high'
  alertThreshold: number
  actions: string[]
}

export type KPIMetric = {
  id: string
  name: string
  description: string
  unit: string
  target?: number
  critical?: number
  displayFormat: 'number' | 'percentage' | 'currency' | 'duration'
}

export type OnboardingStep = {
  id: string
  title: string
  description: string
  component: string
  required: boolean
  completed: boolean
}

export type UserJourney = {
  industryType: IndustryType
  useCases: UseCase[]
  organizationSize: 'individual' | 'small' | 'medium' | 'large' | 'enterprise'
  locations: number
  cameras: number
  users: number
  primaryGoals: string[]
  complianceNeeds: string[]
  integrationNeeds: string[]
  onboardingSteps: OnboardingStep[]
  completionPercentage: number
}

export type IndustryTemplate = {
  id: string
  name: string
  industryType: IndustryType
  description: string
  features: string[]
  scenarios: ScenarioPreset[]
  dashboardConfig: DashboardLayout
  recommendedAddons: string[]
  estimatedSetupTime: number
  complexity: 'beginner' | 'intermediate' | 'advanced'
}


