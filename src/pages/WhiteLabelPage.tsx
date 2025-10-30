import { useState } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Input } from '../components/catalyst/input'
import { Field, Label } from '../components/catalyst/fieldset'

export function WhiteLabelPage() {
  const [branding, setBranding] = useState({
    companyName: 'VisionCore',
    logo: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    customDomain: '',
  })

  const handleSave = () => {
    localStorage.setItem('whiteLabel', JSON.stringify(branding))
    alert('Branding settings saved! Reload to see changes.')
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading>White-Label Branding</Heading>
        <Text className="mt-2">Customize the platform with your brand identity</Text>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-6">
          <Field>
            <Label>Company Name</Label>
            <Input value={branding.companyName} onChange={(e) => setBranding({...branding, companyName: e.target.value})} />
          </Field>

          <Field>
            <Label>Primary Color</Label>
            <div className="flex gap-4">
              <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="h-10 w-20" />
              <Input value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} />
            </div>
          </Field>

          <Field>
            <Label>Secondary Color</Label>
            <div className="flex gap-4">
              <input type="color" value={branding.secondaryColor} onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})} className="h-10 w-20" />
              <Input value={branding.secondaryColor} onChange={(e) => setBranding({...branding, secondaryColor: e.target.value})} />
            </div>
          </Field>

          <Field>
            <Label>Custom Domain</Label>
            <Input value={branding.customDomain} onChange={(e) => setBranding({...branding, customDomain: e.target.value})} placeholder="vms.yourcompany.com" />
          </Field>

          <Button color="blue" onClick={handleSave}>Save Branding</Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
        <Heading level={3} className="mb-2">Preview</Heading>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6" style={{ borderTop: `4px solid ${branding.primaryColor}` }}>
          <Heading level={2} style={{ color: branding.primaryColor }}>{branding.companyName}</Heading>
          <Text>Your custom branded platform</Text>
        </div>
      </div>
    </div>
  )
}

