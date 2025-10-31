import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Tenant, TenantUser } from '../types/tenant'

type TenantContextType = {
  tenant: Tenant | null
  currentUser: TenantUser | null
  isLoading: boolean
  switchTenant: (tenantId: string) => Promise<void>
  updateTenant: (updates: Partial<Tenant>) => Promise<void>
  hasPermission: (permission: string) => boolean
  canAccessFeature: (feature: string) => boolean
}

export const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [currentUser, setCurrentUser] = useState<TenantUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load tenant dari localStorage atau API
    loadTenant()
  }, [])

  const loadTenant = async () => {
    try {
      setIsLoading(true)
      
      // Simulate API call - replace with actual API
      const tenantId = localStorage.getItem('currentTenantId')
      const userId = localStorage.getItem('currentUserId')
      
      if (tenantId && userId) {
        // Mock data - replace with actual API call
        const mockTenant: Tenant = {
          id: tenantId,
          name: 'Demo Company',
          slug: 'demo-company',
          status: 'active',
          subscription: {
            tier: 'professional',
            status: 'active',
            startDate: new Date('2024-01-01'),
            trialEndsAt: undefined,
            autoRenew: true,
            limits: {
              cameras: 100,
              users: 20,
              storage: 500 * 1024 * 1024 * 1024, // 500GB in bytes
              retention: 90,
              apiCalls: 100000,
              bandwidth: 1000 * 1024 * 1024 * 1024, // 1TB in bytes
            },
            addons: [],
          },
          storage: {
            type: 'cloud',
            provider: 'visioncore',
            region: 'us-east',
            config: {
              encryption: true,
              compression: true,
              retention: {
                hot: 30,
                warm: 60,
                cold: 90,
              },
            },
            usage: {
              total: 500 * 1024 * 1024 * 1024,
              used: 250 * 1024 * 1024 * 1024,
              available: 250 * 1024 * 1024 * 1024,
              videos: 200 * 1024 * 1024 * 1024,
              snapshots: 30 * 1024 * 1024 * 1024,
              analytics: 20 * 1024 * 1024 * 1024,
              lastUpdated: new Date(),
            },
          },
          settings: {
            general: {
              timezone: 'Asia/Jakarta',
              language: 'id',
              dateFormat: 'DD/MM/YYYY',
              currency: 'IDR',
            },
            security: {
              mfa: true,
              sso: false,
              ipWhitelist: [],
              sessionTimeout: 3600,
              passwordPolicy: {
                minLength: 8,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true,
                expiryDays: 90,
              },
            },
            notifications: {
              email: true,
              sms: false,
              webhook: false,
            },
            features: {
              aiAnalytics: true,
              realTimeAlerts: true,
              customModels: false,
              apiAccess: true,
              whiteLabel: false,
            },
            dataResidency: 'ap-southeast',
          },
          billing: {
            email: 'billing@democompany.com',
            company: 'Demo Company Ltd',
            address: {
              street: 'Jl. Sudirman No. 123',
              city: 'Jakarta',
              state: 'DKI Jakarta',
              country: 'Indonesia',
              postalCode: '12345',
            },
            invoices: [],
            nextBillingDate: new Date('2024-12-01'),
            balance: 0,
          },
          metadata: {
            industry: 'Security',
            companySize: '50-200',
            useCase: 'Smart City',
            customFields: {},
          },
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
        }

        const mockUser: TenantUser = {
          id: userId,
          tenantId: tenantId,
          email: 'admin@democompany.com',
          name: 'Admin User',
          role: 'admin',
          permissions: ['*'], // All permissions
          status: 'active',
          lastLogin: new Date(),
          createdAt: new Date('2024-01-01'),
        }

        setTenant(mockTenant)
        setCurrentUser(mockUser)
      }
    } catch (error) {
      console.error('Failed to load tenant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const switchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true)
      localStorage.setItem('currentTenantId', tenantId)
      await loadTenant()
    } catch (error) {
      console.error('Failed to switch tenant:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateTenant = async (updates: Partial<Tenant>) => {
    try {
      if (!tenant) return
      
      // Simulate API call
      const updatedTenant = { ...tenant, ...updates, updatedAt: new Date() }
      setTenant(updatedTenant)
      
      // In real app, call API here
      console.log('Tenant updated:', updates)
    } catch (error) {
      console.error('Failed to update tenant:', error)
      throw error
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!currentUser) return false
    
    // Owner and admin have all permissions
    if (currentUser.role === 'owner' || currentUser.role === 'admin') {
      return true
    }
    
    // Check if user has specific permission
    return currentUser.permissions.includes(permission) || currentUser.permissions.includes('*')
  }

  const canAccessFeature = (feature: string): boolean => {
    if (!tenant) return false
    
    const features = tenant.settings.features as Record<string, boolean>
    return features[feature] === true
  }

  return (
    <TenantContext.Provider
      value={{
        tenant,
        currentUser,
        isLoading,
        switchTenant,
        updateTenant,
        hasPermission,
        canAccessFeature,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}


