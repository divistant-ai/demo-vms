import { useState } from 'react'
import { Heading, Subheading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Input } from '../components/catalyst/input'
import { Field, Label, Description } from '../components/catalyst/fieldset'
import { Badge } from '../components/catalyst/badge'
import { Select } from '../components/catalyst/select'

type BrandingConfig = {
  companyName: string
  tagline: string
  logo: string
  favicon: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  customDomain: string
  supportEmail: string
  copyrightText: string
  loginBackground: string
  fontFamily: string
  showPoweredBy: boolean
}

const presetThemes = [
  { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#0284C7', accent: '#06B6D4' },
  { name: 'Forest Green', primary: '#10B981', secondary: '#059669', accent: '#14B8A6' },
  { name: 'Royal Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA' },
  { name: 'Sunset Orange', primary: '#F59E0B', secondary: '#D97706', accent: '#F97316' },
  { name: 'Rose Pink', primary: '#EC4899', secondary: '#DB2777', accent: '#F472B6' },
  { name: 'Corporate Gray', primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF' },
]

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
]

export function WhiteLabelPage() {
  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: 'VisionCore',
    tagline: 'AI-Powered Video Management System',
    logo: '',
    favicon: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#06B6D4',
    customDomain: '',
    supportEmail: 'support@visioncore.ai',
    copyrightText: '© 2024 VisionCore. All rights reserved.',
    loginBackground: 'gradient',
    fontFamily: 'Inter',
    showPoweredBy: true,
  })

  const [activeTab, setActiveTab] = useState<'colors' | 'branding' | 'domain' | 'preview'>('colors')

  const handleSave = () => {
    localStorage.setItem('whiteLabel', JSON.stringify(branding))
    alert('✅ Branding settings saved!\n\nChanges will be applied on next reload.')
  }

  const handleReset = () => {
    if (confirm('Reset all branding to default?')) {
      setBranding({
        companyName: 'VisionCore',
        tagline: 'AI-Powered Video Management System',
        logo: '',
        favicon: '',
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        accentColor: '#06B6D4',
        customDomain: '',
        supportEmail: 'support@visioncore.ai',
        copyrightText: '© 2024 VisionCore. All rights reserved.',
        loginBackground: 'gradient',
        fontFamily: 'Inter',
        showPoweredBy: true,
      })
    }
  }

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setBranding({
      ...branding,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading>White-Label Branding</Heading>
          <Text className="mt-2">Customize the platform with your brand identity</Text>
        </div>
        <div className="flex gap-2">
          <Button plain onClick={handleReset}>Reset to Default</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Customization</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">85%</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Brand Colors</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">3</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Custom Domain</Text>
          <div className="text-2xl font-semibold text-zinc-950 dark:text-white mt-1">
            {branding.customDomain ? '✓' : '—'}
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">Status</Text>
          <Badge color="green" className="mt-1">Active</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {(['colors', 'branding', 'domain', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-6">
          {/* Preset Themes */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <Subheading className="mb-4">Preset Themes</Subheading>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {presetThemes.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 transition-colors text-left"
                >
                  <div className="flex gap-2 mb-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }} />
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }} />
                  </div>
                  <Text className="font-medium">{preset.name}</Text>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
            <Subheading className="mb-4">Custom Colors</Subheading>
            <div className="space-y-6">
              <Field>
                <Label>Primary Color</Label>
                <Description>Main brand color used for buttons and accents</Description>
                <div className="flex gap-4 mt-2">
                  <input
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="h-12 w-24 rounded border border-zinc-300 dark:border-zinc-700"
                  />
                  <Input
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </Field>

              <Field>
                <Label>Secondary Color</Label>
                <Description>Supporting color for gradients and highlights</Description>
                <div className="flex gap-4 mt-2">
                  <input
                    type="color"
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="h-12 w-24 rounded border border-zinc-300 dark:border-zinc-700"
                  />
                  <Input
                    value={branding.secondaryColor}
                    onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </Field>

              <Field>
                <Label>Accent Color</Label>
                <Description>Additional color for badges and notifications</Description>
                <div className="flex gap-4 mt-2">
                  <input
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="h-12 w-24 rounded border border-zinc-300 dark:border-zinc-700"
                  />
                  <Input
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-6">
            <Field>
              <Label>Company Name</Label>
              <Description>Your company or organization name</Description>
              <Input
                value={branding.companyName}
                onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                className="mt-2"
              />
            </Field>

            <Field>
              <Label>Tagline</Label>
              <Description>A short description of your platform</Description>
              <Input
                value={branding.tagline}
                onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                className="mt-2"
              />
            </Field>

            <Field>
              <Label>Support Email</Label>
              <Description>Email address for customer support</Description>
              <Input
                type="email"
                value={branding.supportEmail}
                onChange={(e) => setBranding({ ...branding, supportEmail: e.target.value })}
                className="mt-2"
              />
            </Field>

            <Field>
              <Label>Copyright Text</Label>
              <Description>Text displayed in the footer</Description>
              <Input
                value={branding.copyrightText}
                onChange={(e) => setBranding({ ...branding, copyrightText: e.target.value })}
                className="mt-2"
              />
            </Field>

            <Field>
              <Label>Font Family</Label>
              <Description>Typography for the entire platform</Description>
              <Select
                value={branding.fontFamily}
                onChange={(e) => setBranding({ ...branding, fontFamily: e.target.value })}
                className="mt-2"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label>Login Background</Label>
              <Description>Background style for the login page</Description>
              <Select
                value={branding.loginBackground}
                onChange={(e) => setBranding({ ...branding, loginBackground: e.target.value })}
                className="mt-2"
              >
                <option value="gradient">Gradient</option>
                <option value="solid">Solid Color</option>
                <option value="image">Custom Image</option>
                <option value="video">Video Background</option>
              </Select>
            </Field>
          </div>
        </div>
      )}

      {/* Domain Tab */}
      {activeTab === 'domain' && (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
          <div className="space-y-6">
            <Field>
              <Label>Custom Domain</Label>
              <Description>
                Point your custom domain to this platform (e.g., vms.yourcompany.com)
              </Description>
              <Input
                value={branding.customDomain}
                onChange={(e) => setBranding({ ...branding, customDomain: e.target.value })}
                placeholder="vms.yourcompany.com"
                className="mt-2"
              />
            </Field>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <Subheading className="text-blue-900 dark:text-blue-100 mb-2">
                DNS Configuration
              </Subheading>
              <Text className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Add these DNS records to your domain provider:
              </Text>
              <div className="bg-white dark:bg-zinc-800 rounded p-3 font-mono text-sm">
                <div className="mb-2">
                  <strong>Type:</strong> CNAME
                </div>
                <div className="mb-2">
                  <strong>Name:</strong> vms (or your subdomain)
                </div>
                <div>
                  <strong>Value:</strong> platform.visioncore.ai
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!branding.showPoweredBy}
                onChange={(e) => setBranding({ ...branding, showPoweredBy: !e.target.checked })}
                className="h-4 w-4"
              />
              <div>
                <Label>Remove "Powered by VisionCore"</Label>
                <Description>Hide the powered by badge (Enterprise plan only)</Description>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
            <Subheading className="mb-4">Live Preview</Subheading>
            
            {/* Login Page Preview */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
              <div
                className="h-32"
                style={{
                  background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.secondaryColor})`,
                }}
              />
              <div className="p-8">
                <div className="text-center mb-8">
                  <Heading
                    level={1}
                    style={{ color: branding.primaryColor, fontFamily: branding.fontFamily }}
                  >
                    {branding.companyName}
                  </Heading>
                  <Text className="mt-2">{branding.tagline}</Text>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Email"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
                      disabled
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700"
                      disabled
                    />
                  </div>
                  <button
                    className="w-full px-4 py-2 rounded-lg text-white font-medium"
                    style={{ backgroundColor: branding.primaryColor }}
                    disabled
                  >
                    Sign In
                  </button>
                </div>

                <div className="mt-8 text-center text-xs text-zinc-500">
                  {branding.copyrightText}
                  {branding.showPoweredBy && (
                    <div className="mt-2">Powered by VisionCore</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2} style={{ color: branding.primaryColor }}>
                Dashboard
              </Heading>
              <Badge style={{ backgroundColor: branding.accentColor, color: 'white' }}>
                Live
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: `${branding.primaryColor}15` }}
                >
                  <Text className="text-sm">Metric {i}</Text>
                  <div
                    className="text-2xl font-bold mt-2"
                    style={{ color: branding.primaryColor }}
                  >
                    {i * 123}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


