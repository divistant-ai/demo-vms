export type SubscriptionTier = 'free' | 'starter' | 'professional' | 'enterprise' | 'enterprise_plus'

export type StorageType = 'cloud' | 'hybrid' | 'byos'

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'cancelled' | 'pending'

export type DataResidency = 'us-east' | 'us-west' | 'eu-west' | 'ap-southeast' | 'ap-northeast'

export type Tenant = {
  id: string
  name: string
  slug: string
  domain?: string
  status: TenantStatus
  subscription: TenantSubscription
  storage: TenantStorage
  settings: TenantSettings
  billing: TenantBilling
  metadata: TenantMetadata
  createdAt: Date
  updatedAt: Date
}

export type TenantSubscription = {
  tier: SubscriptionTier
  status: 'active' | 'past_due' | 'cancelled' | 'trial'
  startDate: Date
  endDate?: Date
  trialEndsAt?: Date
  autoRenew: boolean
  limits: SubscriptionLimits
  addons: Array<SubscriptionAddon>
}

export type SubscriptionLimits = {
  cameras: number
  users: number
  storage: number
  retention: number
  apiCalls: number
  bandwidth: number
}

export type SubscriptionAddon = {
  id: string
  type: 'storage' | 'cameras' | 'analytics' | 'integration' | 'support'
  name: string
  quantity: number
  price: number
  billingCycle: 'monthly' | 'annual'
  addedAt: Date
}

export type TenantStorage = {
  type: StorageType
  provider?: 'visioncore' | 'aws' | 'azure' | 'gcp' | 'minio' | 'custom'
  region?: DataResidency
  config: StorageConfig
  usage: StorageUsage
}

export type StorageConfig = {
  endpoint?: string
  bucket?: string
  accessKey?: string
  secretKey?: string
  encryption: boolean
  compression: boolean
  retention: {
    hot: number
    warm: number
    cold: number
  }
}

export type StorageUsage = {
  total: number
  used: number
  available: number
  videos: number
  snapshots: number
  analytics: number
  lastUpdated: Date
}

export type TenantSettings = {
  general: {
    timezone: string
    language: string
    dateFormat: string
    currency: string
  }
  security: {
    mfa: boolean
    sso: boolean
    ipWhitelist: Array<string>
    sessionTimeout: number
    passwordPolicy: PasswordPolicy
  }
  notifications: {
    email: boolean
    sms: boolean
    webhook: boolean
    webhookUrl?: string
  }
  features: {
    aiAnalytics: boolean
    realTimeAlerts: boolean
    customModels: boolean
    apiAccess: boolean
    whiteLabel: boolean
  }
  dataResidency: DataResidency
}

export type PasswordPolicy = {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expiryDays: number
}

export type TenantBilling = {
  email: string
  company?: string
  address: BillingAddress
  paymentMethod?: PaymentMethod
  invoices: Array<Invoice>
  nextBillingDate: Date
  balance: number
}

export type BillingAddress = {
  street: string
  city: string
  state: string
  country: string
  postalCode: string
  taxId?: string
}

export type PaymentMethod = {
  type: 'card' | 'bank' | 'invoice'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

export type Invoice = {
  id: string
  number: string
  date: Date
  dueDate: Date
  amount: number
  tax: number
  total: number
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  items: Array<InvoiceItem>
  pdfUrl?: string
}

export type InvoiceItem = {
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export type TenantMetadata = {
  industry?: string
  companySize?: string
  useCase?: string
  referralSource?: string
  salesRep?: string
  customFields: Record<string, unknown>
}

export type TenantUser = {
  id: string
  tenantId: string
  email: string
  name: string
  role: TenantRole
  permissions: Array<string>
  status: 'active' | 'invited' | 'suspended'
  lastLogin?: Date
  createdAt: Date
}

export type TenantRole = 'owner' | 'admin' | 'manager' | 'operator' | 'viewer'

export type TenantInvitation = {
  id: string
  tenantId: string
  email: string
  role: TenantRole
  invitedBy: string
  expiresAt: Date
  status: 'pending' | 'accepted' | 'expired' | 'cancelled'
  createdAt: Date
}

export type TenantApiKey = {
  id: string
  tenantId: string
  name: string
  key: string
  permissions: Array<string>
  rateLimit: number
  lastUsed?: Date
  expiresAt?: Date
  status: 'active' | 'revoked'
  createdAt: Date
}

export type TenantAuditLog = {
  id: string
  tenantId: string
  userId: string
  action: string
  resource: string
  resourceId?: string
  changes?: Record<string, unknown>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

export type TenantUsageMetrics = {
  tenantId: string
  period: Date
  cameras: {
    total: number
    online: number
    offline: number
  }
  storage: {
    used: number
    bandwidth: number
  }
  api: {
    calls: number
    errors: number
  }
  analytics: {
    detections: number
    alerts: number
  }
  users: {
    active: number
    total: number
  }
}

export type DataSourceConnection = {
  id: string
  tenantId: string
  name: string
  type: 'local' | 'cloud' | 'edge'
  status: 'connected' | 'disconnected' | 'error'
  config: {
    endpoint: string
    protocol: 'rtsp' | 'http' | 'websocket'
    authentication: {
      type: 'basic' | 'token' | 'certificate'
      credentials?: Record<string, string>
    }
  }
  cameras: Array<string>
  lastSync: Date
  createdAt: Date
}


