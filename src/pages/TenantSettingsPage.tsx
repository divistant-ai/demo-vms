import { useState } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Textarea } from '../components/catalyst/textarea'
import { useTenant } from '../hooks/useTenant'
import type { StorageType, DataResidency } from '../types/tenant'

export function TenantSettingsPage() {
  const { tenant, updateTenant, canAccessFeature } = useTenant()
  const [activeTab, setActiveTab] = useState<'general' | 'subscription' | 'storage' | 'security' | 'billing'>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  if (!tenant) {
    return <div>Loading...</div>
  }

  // Handler functions
  const handleSaveChanges = async (section: string) => {
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage({ type: 'success', text: `${section} settings saved successfully!` })
      
      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpgradePlan = () => {
    alert('Upgrade Plan: This would open a dialog to select a new subscription tier.')
  }

  const handleViewAllPlans = () => {
    alert('View All Plans: This would show a comparison of all available subscription tiers.')
  }

  const handleRemoveAddon = (addonId: string) => {
    if (confirm('Are you sure you want to remove this add-on?')) {
      alert(`Remove Add-on: ${addonId}`)
      // In real app: call API to remove addon
    }
  }

  const handleTestConnection = async () => {
    alert('Testing storage connection...')
    // In real app: test the storage connection
    await new Promise(resolve => setTimeout(resolve, 2000))
    alert('Connection test successful!')
  }

  const handleAddPaymentMethod = () => {
    alert('Add Payment Method: This would open a dialog to add credit card or payment details.')
  }

  const handleRemovePaymentMethod = () => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      alert('Remove Payment Method')
      // In real app: call API to remove payment method
    }
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice: ${invoiceId}`)
    // In real app: trigger invoice PDF download
  }

  const handleDownloadAllInvoices = () => {
    alert('Downloading all invoices as ZIP file...')
    // In real app: trigger bulk download
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return `${gb.toFixed(2)} GB`
  }

  const getSubscriptionBadgeColor = () => {
    switch (tenant.subscription.tier) {
      case 'free': return 'zinc'
      case 'starter': return 'blue'
      case 'professional': return 'purple'
      case 'enterprise': return 'amber'
      case 'enterprise_plus': return 'red'
      default: return 'zinc'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Heading>Tenant Settings</Heading>
        <Text className="mt-2">
          Manage your organization settings, subscription, and preferences
        </Text>
        
        {/* Save Message */}
        {saveMessage && (
          <div className={`mt-4 p-4 rounded-lg ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {saveMessage.type === 'success' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <Text className="font-medium">{saveMessage.text}</Text>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general', label: 'General' },
            { id: 'subscription', label: 'Subscription' },
            { id: 'storage', label: 'Storage' },
            { id: 'security', label: 'Security' },
            { id: 'billing', label: 'Billing' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Organization Information</Heading>
            
            <FieldGroup>
              <Field>
                <Label>Organization Name</Label>
                <Input
                  value={tenant.name}
                  onChange={(e) => updateTenant({ name: e.target.value })}
                />
              </Field>

              <Field>
                <Label>Slug</Label>
                <Input
                  value={tenant.slug}
                  disabled
                  className="bg-gray-50 dark:bg-gray-900"
                />
                <Text className="text-sm text-gray-500 mt-1">
                  Your organization URL: app.visioncore.ai/{tenant.slug}
                </Text>
              </Field>

              <Field>
                <Label>Custom Domain (Optional)</Label>
                <Input
                  value={tenant.domain || ''}
                  placeholder="vms.yourcompany.com"
                  onChange={(e) => updateTenant({ domain: e.target.value })}
                  disabled={!canAccessFeature('whiteLabel')}
                />
                {!canAccessFeature('whiteLabel') && (
                  <Text className="text-sm text-amber-600 mt-1">
                    Custom domain requires Enterprise plan
                  </Text>
                )}
              </Field>
            </FieldGroup>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Regional Settings</Heading>
            
            <FieldGroup>
              <Field>
                <Label>Timezone</Label>
                <Select
                  value={tenant.settings.general.timezone}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      general: {
                        ...tenant.settings.general,
                        timezone: e.target.value,
                      },
                    },
                  })}
                >
                  <option value="Asia/Jakarta">Asia/Jakarta (GMT+7)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                </Select>
              </Field>

              <Field>
                <Label>Language</Label>
                <Select
                  value={tenant.settings.general.language}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      general: {
                        ...tenant.settings.general,
                        language: e.target.value,
                      },
                    },
                  })}
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                </Select>
              </Field>

              <Field>
                <Label>Date Format</Label>
                <Select
                  value={tenant.settings.general.dateFormat}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      general: {
                        ...tenant.settings.general,
                        dateFormat: e.target.value,
                      },
                    },
                  })}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </Field>

              <Field>
                <Label>Currency</Label>
                <Select
                  value={tenant.settings.general.currency}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      general: {
                        ...tenant.settings.general,
                        currency: e.target.value,
                      },
                    },
                  })}
                >
                  <option value="IDR">IDR - Indonesian Rupiah</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </Select>
              </Field>
            </FieldGroup>

            <div className="mt-6">
              <Button color="green" onClick={() => handleSaveChanges('General')} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save General Settings'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Heading level={2}>Current Plan</Heading>
                <Text className="mt-1">Manage your subscription and usage</Text>
              </div>
              <Badge color={getSubscriptionBadgeColor()}>
                {tenant.subscription.tier.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Status</Text>
                <div className="mt-2 flex items-center gap-2">
                  <Badge color={tenant.subscription.status === 'active' ? 'green' : 'red'}>
                    {tenant.subscription.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Start Date</Text>
                <Text className="mt-2 font-semibold">
                  {tenant.subscription.startDate.toLocaleDateString()}
                </Text>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Auto Renew</Text>
                <Text className="mt-2 font-semibold">
                  {tenant.subscription.autoRenew ? 'Enabled' : 'Disabled'}
                </Text>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <Heading level={3} className="mb-4">Usage Limits</Heading>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Text>Cameras</Text>
                    <Text className="font-semibold">
                      18 / {tenant.subscription.limits.cameras}
                    </Text>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(18 / tenant.subscription.limits.cameras) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Text>Users</Text>
                    <Text className="font-semibold">
                      5 / {tenant.subscription.limits.users}
                    </Text>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(5 / tenant.subscription.limits.users) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Text>Storage</Text>
                    <Text className="font-semibold">
                      {formatBytes(tenant.storage.usage.used)} / {formatBytes(tenant.subscription.limits.storage)}
                    </Text>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(tenant.storage.usage.used / tenant.subscription.limits.storage) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <Text>API Calls (this month)</Text>
                    <Text className="font-semibold">
                      45,230 / {tenant.subscription.limits.apiCalls.toLocaleString()}
                    </Text>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-amber-600 h-2 rounded-full"
                      style={{ width: `${(45230 / tenant.subscription.limits.apiCalls) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button color="blue" onClick={handleUpgradePlan}>Upgrade Plan</Button>
              <Button color="zinc" onClick={handleViewAllPlans}>View All Plans</Button>
            </div>
          </div>

          {tenant.subscription.addons.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <Heading level={2} className="mb-4">Active Add-ons</Heading>
              
              <div className="space-y-3">
                {tenant.subscription.addons.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                      <Text className="font-semibold">{addon.name}</Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {addon.quantity} • {addon.billingCycle}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="font-semibold">${addon.price}/mo</Text>
                      <Button color="red" className="mt-2 text-xs" onClick={() => handleRemoveAddon(addon.id)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Storage Tab */}
      {activeTab === 'storage' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Storage Configuration</Heading>
            
            <FieldGroup>
              <Field>
                <Label>Storage Type</Label>
                <Select
                  value={tenant.storage.type}
                  onChange={(e) => updateTenant({
                    storage: {
                      ...tenant.storage,
                      type: e.target.value as StorageType,
                    },
                  })}
                >
                  <option value="cloud">Cloud Storage (Managed by VisionCore)</option>
                  <option value="hybrid">Hybrid Storage (Cloud + Your Storage)</option>
                  <option value="byos">Bring Your Own Storage (BYOS)</option>
                </Select>
                <Text className="text-sm text-gray-500 mt-1">
                  {tenant.storage.type === 'cloud' && 'Fully managed storage with automatic backups'}
                  {tenant.storage.type === 'hybrid' && 'Combine cloud and your own storage for flexibility'}
                  {tenant.storage.type === 'byos' && 'Use your own storage infrastructure'}
                </Text>
              </Field>

              {tenant.storage.type === 'cloud' && (
                <>
                  <Field>
                    <Label>Provider</Label>
                    <Input value="VisionCore Cloud" disabled className="bg-gray-50 dark:bg-gray-900" />
                  </Field>

                  <Field>
                    <Label>Data Residency</Label>
                    <Select
                      value={tenant.storage.region || 'us-east'}
                      onChange={(e) => updateTenant({
                        storage: {
                          ...tenant.storage,
                          region: e.target.value as DataResidency,
                        },
                      })}
                    >
                      <option value="us-east">US East (Virginia)</option>
                      <option value="us-west">US West (California)</option>
                      <option value="eu-west">EU West (Ireland)</option>
                      <option value="ap-southeast">Asia Pacific (Singapore)</option>
                      <option value="ap-northeast">Asia Pacific (Tokyo)</option>
                    </Select>
                  </Field>
                </>
              )}

              {tenant.storage.type === 'byos' && (
                <>
                  <Field>
                    <Label>Storage Provider</Label>
                    <Select
                      value={tenant.storage.provider || 'aws'}
                      onChange={(e) => updateTenant({
                        storage: {
                          ...tenant.storage,
                          provider: e.target.value as typeof tenant.storage.provider,
                        },
                      })}
                    >
                      <option value="aws">AWS S3</option>
                      <option value="azure">Azure Blob Storage</option>
                      <option value="gcp">Google Cloud Storage</option>
                      <option value="minio">MinIO (On-premise)</option>
                      <option value="custom">Custom S3-compatible</option>
                    </Select>
                  </Field>

                  <Field>
                    <Label>Endpoint URL</Label>
                    <Input
                      value={tenant.storage.config.endpoint || ''}
                      placeholder="https://s3.amazonaws.com"
                      onChange={(e) => updateTenant({
                        storage: {
                          ...tenant.storage,
                          config: {
                            ...tenant.storage.config,
                            endpoint: e.target.value,
                          },
                        },
                      })}
                    />
                  </Field>

                  <Field>
                    <Label>Bucket Name</Label>
                    <Input
                      value={tenant.storage.config.bucket || ''}
                      placeholder="my-vms-bucket"
                      onChange={(e) => updateTenant({
                        storage: {
                          ...tenant.storage,
                          config: {
                            ...tenant.storage.config,
                            bucket: e.target.value,
                          },
                        },
                      })}
                    />
                  </Field>

                  <Field>
                    <Label>Access Key</Label>
                    <Input
                      type="password"
                      value={tenant.storage.config.accessKey || ''}
                      placeholder="••••••••••••••••"
                      onChange={(e) => updateTenant({
                        storage: {
                          ...tenant.storage,
                          config: {
                            ...tenant.storage.config,
                            accessKey: e.target.value,
                          },
                        },
                      })}
                    />
                  </Field>

                  <Field>
                    <Label>Secret Key</Label>
                    <Input
                      type="password"
                      value={tenant.storage.config.secretKey || ''}
                      placeholder="••••••••••••••••"
                      onChange={(e) => updateTenant({
                        storage: {
                          ...tenant.storage,
                          config: {
                            ...tenant.storage.config,
                            secretKey: e.target.value,
                          },
                        },
                      })}
                    />
                  </Field>
                </>
              )}

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tenant.storage.config.encryption}
                    onChange={(e) => updateTenant({
                      storage: {
                        ...tenant.storage,
                        config: {
                          ...tenant.storage.config,
                          encryption: e.target.checked,
                        },
                      },
                    })}
                    className="rounded"
                  />
                  <Text>Enable Encryption</Text>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tenant.storage.config.compression}
                    onChange={(e) => updateTenant({
                      storage: {
                        ...tenant.storage,
                        config: {
                          ...tenant.storage.config,
                          compression: e.target.checked,
                        },
                      },
                    })}
                    className="rounded"
                  />
                  <Text>Enable Compression</Text>
                </label>
              </div>
            </FieldGroup>

            <div className="mt-6 flex gap-3">
              <Button color="blue" onClick={handleTestConnection}>Test Connection</Button>
              <Button color="green" onClick={() => handleSaveChanges('Storage')} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Storage Usage</Heading>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Text className="text-sm text-blue-600 dark:text-blue-400">Videos</Text>
                <Text className="mt-2 text-2xl font-bold">
                  {formatBytes(tenant.storage.usage.videos)}
                </Text>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Text className="text-sm text-green-600 dark:text-green-400">Snapshots</Text>
                <Text className="mt-2 text-2xl font-bold">
                  {formatBytes(tenant.storage.usage.snapshots)}
                </Text>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Text className="text-sm text-purple-600 dark:text-purple-400">Analytics</Text>
                <Text className="mt-2 text-2xl font-bold">
                  {formatBytes(tenant.storage.usage.analytics)}
                </Text>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <Text>Total Usage</Text>
                <Text className="font-semibold">
                  {formatBytes(tenant.storage.usage.used)} / {formatBytes(tenant.storage.usage.total)}
                </Text>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                  style={{ width: `${(tenant.storage.usage.used / tenant.storage.usage.total) * 100}%` }}
                />
              </div>
              <Text className="text-sm text-gray-500 mt-2">
                Last updated: {tenant.storage.usage.lastUpdated.toLocaleString()}
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Security Settings</Heading>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <Text className="font-semibold">Multi-Factor Authentication (MFA)</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Require 2FA for all users
                  </Text>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tenant.settings.security.mfa}
                    onChange={(e) => updateTenant({
                      settings: {
                        ...tenant.settings,
                        security: {
                          ...tenant.settings.security,
                          mfa: e.target.checked,
                        },
                      },
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <Text className="font-semibold">Single Sign-On (SSO)</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Enable SAML/OAuth SSO
                  </Text>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tenant.settings.security.sso}
                    onChange={(e) => updateTenant({
                      settings: {
                        ...tenant.settings,
                        security: {
                          ...tenant.settings.security,
                          sso: e.target.checked,
                        },
                      },
                    })}
                    className="sr-only peer"
                    disabled={!canAccessFeature('whiteLabel')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <Field>
                <Label>Session Timeout (seconds)</Label>
                <Input
                  type="number"
                  value={tenant.settings.security.sessionTimeout}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      security: {
                        ...tenant.settings.security,
                        sessionTimeout: parseInt(e.target.value),
                      },
                    },
                  })}
                />
              </Field>

              <Field>
                <Label>IP Whitelist</Label>
                <Textarea
                  value={tenant.settings.security.ipWhitelist.join('\n')}
                  placeholder="Enter IP addresses (one per line)"
                  rows={4}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      security: {
                        ...tenant.settings.security,
                        ipWhitelist: e.target.value.split('\n').filter(ip => ip.trim()),
                      },
                    },
                  })}
                />
                <Text className="text-sm text-gray-500 mt-1">
                  Leave empty to allow all IPs
                </Text>
              </Field>
            </div>

            <div className="mt-6">
              <Button color="green" onClick={() => handleSaveChanges('Security')} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Password Policy</Heading>
            
            <FieldGroup>
              <Field>
                <Label>Minimum Length</Label>
                <Input
                  type="number"
                  value={tenant.settings.security.passwordPolicy.minLength}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      security: {
                        ...tenant.settings.security,
                        passwordPolicy: {
                          ...tenant.settings.security.passwordPolicy,
                          minLength: parseInt(e.target.value),
                        },
                      },
                    },
                  })}
                />
              </Field>

              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tenant.settings.security.passwordPolicy.requireUppercase}
                    onChange={(e) => updateTenant({
                      settings: {
                        ...tenant.settings,
                        security: {
                          ...tenant.settings.security,
                          passwordPolicy: {
                            ...tenant.settings.security.passwordPolicy,
                            requireUppercase: e.target.checked,
                          },
                        },
                      },
                    })}
                    className="rounded"
                  />
                  <Text>Require Uppercase Letters</Text>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tenant.settings.security.passwordPolicy.requireLowercase}
                    onChange={(e) => updateTenant({
                      settings: {
                        ...tenant.settings,
                        security: {
                          ...tenant.settings.security,
                          passwordPolicy: {
                            ...tenant.settings.security.passwordPolicy,
                            requireLowercase: e.target.checked,
                          },
                        },
                      },
                    })}
                    className="rounded"
                  />
                  <Text>Require Lowercase Letters</Text>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tenant.settings.security.passwordPolicy.requireNumbers}
                    onChange={(e) => updateTenant({
                      settings: {
                        ...tenant.settings,
                        security: {
                          ...tenant.settings.security,
                          passwordPolicy: {
                            ...tenant.settings.security.passwordPolicy,
                            requireNumbers: e.target.checked,
                          },
                        },
                      },
                    })}
                    className="rounded"
                  />
                  <Text>Require Numbers</Text>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tenant.settings.security.passwordPolicy.requireSpecialChars}
                    onChange={(e) => updateTenant({
                      settings: {
                        ...tenant.settings,
                        security: {
                          ...tenant.settings.security,
                          passwordPolicy: {
                            ...tenant.settings.security.passwordPolicy,
                            requireSpecialChars: e.target.checked,
                          },
                        },
                      },
                    })}
                    className="rounded"
                  />
                  <Text>Require Special Characters</Text>
                </label>
              </div>

              <Field>
                <Label>Password Expiry (days)</Label>
                <Input
                  type="number"
                  value={tenant.settings.security.passwordPolicy.expiryDays}
                  onChange={(e) => updateTenant({
                    settings: {
                      ...tenant.settings,
                      security: {
                        ...tenant.settings.security,
                        passwordPolicy: {
                          ...tenant.settings.security.passwordPolicy,
                          expiryDays: parseInt(e.target.value),
                        },
                      },
                    },
                  })}
                />
                <Text className="text-sm text-gray-500 mt-1">
                  Set to 0 to disable password expiry
                </Text>
              </Field>
            </FieldGroup>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="mb-6">Billing Information</Heading>
            
            <FieldGroup>
              <Field>
                <Label>Billing Email</Label>
                <Input
                  type="email"
                  value={tenant.billing.email}
                  onChange={(e) => updateTenant({
                    billing: {
                      ...tenant.billing,
                      email: e.target.value,
                    },
                  })}
                />
              </Field>

              <Field>
                <Label>Company Name</Label>
                <Input
                  value={tenant.billing.company || ''}
                  onChange={(e) => updateTenant({
                    billing: {
                      ...tenant.billing,
                      company: e.target.value,
                    },
                  })}
                />
              </Field>

              <Field>
                <Label>Street Address</Label>
                <Input
                  value={tenant.billing.address.street}
                  onChange={(e) => updateTenant({
                    billing: {
                      ...tenant.billing,
                      address: {
                        ...tenant.billing.address,
                        street: e.target.value,
                      },
                    },
                  })}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>City</Label>
                  <Input
                    value={tenant.billing.address.city}
                    onChange={(e) => updateTenant({
                      billing: {
                        ...tenant.billing,
                        address: {
                          ...tenant.billing.address,
                          city: e.target.value,
                        },
                      },
                    })}
                  />
                </Field>

                <Field>
                  <Label>State/Province</Label>
                  <Input
                    value={tenant.billing.address.state}
                    onChange={(e) => updateTenant({
                      billing: {
                        ...tenant.billing,
                        address: {
                          ...tenant.billing.address,
                          state: e.target.value,
                        },
                      },
                    })}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label>Country</Label>
                  <Input
                    value={tenant.billing.address.country}
                    onChange={(e) => updateTenant({
                      billing: {
                        ...tenant.billing,
                        address: {
                          ...tenant.billing.address,
                          country: e.target.value,
                        },
                      },
                    })}
                  />
                </Field>

                <Field>
                  <Label>Postal Code</Label>
                  <Input
                    value={tenant.billing.address.postalCode}
                    onChange={(e) => updateTenant({
                      billing: {
                        ...tenant.billing,
                        address: {
                          ...tenant.billing.address,
                          postalCode: e.target.value,
                        },
                      },
                    })}
                  />
                </Field>
              </div>

              <Field>
                <Label>Tax ID (Optional)</Label>
                <Input
                  value={tenant.billing.address.taxId || ''}
                  placeholder="VAT/GST Number"
                  onChange={(e) => updateTenant({
                    billing: {
                      ...tenant.billing,
                      address: {
                        ...tenant.billing.address,
                        taxId: e.target.value,
                      },
                    },
                  })}
                />
              </Field>
            </FieldGroup>

            <div className="mt-6">
              <Button color="green" onClick={() => handleSaveChanges('Billing')} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Billing Information'}
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2}>Payment Method</Heading>
              <Button color="blue" onClick={handleAddPaymentMethod}>Add Payment Method</Button>
            </div>

            {tenant.billing.paymentMethod ? (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white font-bold text-xs">
                      {tenant.billing.paymentMethod.brand?.toUpperCase()}
                    </div>
                    <div>
                      <Text className="font-semibold">
                        •••• •••• •••• {tenant.billing.paymentMethod.last4}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        Expires {tenant.billing.paymentMethod.expiryMonth}/{tenant.billing.paymentMethod.expiryYear}
                      </Text>
                    </div>
                  </div>
                  <Button color="red" onClick={handleRemovePaymentMethod}>Remove</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No payment method added
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2}>Billing History</Heading>
              <Button color="zinc" onClick={handleDownloadAllInvoices}>Download All</Button>
            </div>

            {tenant.billing.invoices.length > 0 ? (
              <div className="space-y-3">
                {tenant.billing.invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                      <Text className="font-semibold">Invoice #{invoice.number}</Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        {invoice.date.toLocaleDateString()} • Due: {invoice.dueDate.toLocaleDateString()}
                      </Text>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Text className="font-semibold">${invoice.total.toFixed(2)}</Text>
                        <Badge color={invoice.status === 'paid' ? 'green' : invoice.status === 'pending' ? 'yellow' : 'red'}>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button color="zinc" onClick={() => handleDownloadInvoice(invoice.id)}>Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No invoices yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

