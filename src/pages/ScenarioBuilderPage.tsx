import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Button } from '../components/catalyst/button'
import { Input } from '../components/catalyst/input'
import { Textarea } from '../components/catalyst/textarea'
import { Select } from '../components/catalyst/select'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Checkbox } from '../components/catalyst/checkbox'
import { Badge } from '../components/catalyst/badge'
import { Text } from '../components/catalyst/text'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'

type DetectionType = 'object_detection' | 'traffic_monitoring' | 'flood_detection' | 'crowd_detection' | 'fire_detection' | 'loitering' | 'intrusion' | 'abandoned_object' | 'wrong_way' | 'parking_violation'

type ScenarioForm = {
  name: string
  description: string
  type: DetectionType
  enabled: boolean
  parameters: {
    sensitivity: number
    threshold: number
    cooldownPeriod: number
    minConfidence: number
  }
  zones: Array<{
    id: string
    name: string
    coordinates: Array<{ lat: number; lng: number }>
  }>
  assignedCameras: Array<string>
  alertRecipients: Array<string>
}

const DETECTION_TYPES: Array<{ value: DetectionType; label: string; description: string }> = [
  { value: 'object_detection', label: 'Object Detection', description: 'Detect specific objects (vehicles, people, etc.)' },
  { value: 'traffic_monitoring', label: 'Traffic Monitoring', description: 'Monitor traffic flow and congestion' },
  { value: 'flood_detection', label: 'Flood Detection', description: 'Detect rising water levels' },
  { value: 'crowd_detection', label: 'Crowd Detection', description: 'Monitor crowd density and movement' },
  { value: 'fire_detection', label: 'Fire Detection', description: 'Detect smoke and fire' },
  { value: 'loitering', label: 'Loitering Detection', description: 'Detect people staying in area too long' },
  { value: 'intrusion', label: 'Intrusion Detection', description: 'Detect unauthorized access to restricted areas' },
  { value: 'abandoned_object', label: 'Abandoned Object', description: 'Detect objects left unattended' },
  { value: 'wrong_way', label: 'Wrong Way Detection', description: 'Detect vehicles going wrong direction' },
  { value: 'parking_violation', label: 'Parking Violation', description: 'Detect vehicles in no-parking zones' },
]

const MOCK_CAMERAS = [
  { id: 'cam-001', name: 'Downtown Intersection Main St' },
  { id: 'cam-002', name: 'River Bridge - Flood Monitoring' },
  { id: 'cam-003', name: 'Shopping Mall Entrance' },
  { id: 'cam-004', name: 'Highway Exit Ramp' },
  { id: 'cam-005', name: 'Parking Lot Security' },
]

const MOCK_USERS = [
  { id: 'user-001', name: 'Operations Manager' },
  { id: 'user-002', name: 'Security Officer' },
  { id: 'user-003', name: 'Traffic Controller' },
  { id: 'user-004', name: 'Emergency Response' },
]

export function ScenarioBuilderPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [form, setForm] = useState<ScenarioForm>({
    name: '',
    description: '',
    type: 'object_detection',
    enabled: true,
    parameters: {
      sensitivity: 50,
      threshold: 0.8,
      cooldownPeriod: 300,
      minConfidence: 0.7,
    },
    zones: [],
    assignedCameras: [],
    alertRecipients: [],
  })

  const handleInputChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleParameterChange = (field: string, value: number) => {
    setForm(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [field]: value
      }
    }))
  }

  const handleCameraToggle = (cameraId: string) => {
    setForm(prev => ({
      ...prev,
      assignedCameras: prev.assignedCameras.includes(cameraId)
        ? prev.assignedCameras.filter(id => id !== cameraId)
        : [...prev.assignedCameras, cameraId]
    }))
  }

  const handleRecipientToggle = (userId: string) => {
    setForm(prev => ({
      ...prev,
      alertRecipients: prev.alertRecipients.includes(userId)
        ? prev.alertRecipients.filter(id => id !== userId)
        : [...prev.alertRecipients, userId]
    }))
  }

  const handleSave = () => {
    // Mock save scenario
    console.log('Saving scenario:', form)
    navigate('/configuration')
  }

  const steps = [
    { number: 1, title: 'Basic Info', description: 'Scenario name and type' },
    { number: 2, title: 'Parameters', description: 'Detection settings' },
    { number: 3, title: 'Zones', description: 'Define detection areas' },
    { number: 4, title: 'Cameras', description: 'Assign cameras' },
    { number: 5, title: 'Alerts', description: 'Notification settings' },
    { number: 6, title: 'Review', description: 'Preview and save' },
  ]

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <FieldGroup>
            <Field>
              <Label>Scenario Name</Label>
              <Input
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter scenario name..."
              />
            </Field>
            <Field>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this scenario detects..."
                rows={3}
              />
            </Field>
            <Field>
              <Label>Detection Type</Label>
              <Select
                value={form.type}
                onChange={(e) => handleInputChange('type', e.target.value as DetectionType)}
              >
                {DETECTION_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {DETECTION_TYPES.find(t => t.value === form.type)?.description}
              </Text>
            </Field>
            <Field>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={form.enabled}
                  onChange={(checked) => handleInputChange('enabled', checked)}
                />
                <Label>Enable scenario immediately after creation</Label>
              </div>
            </Field>
          </FieldGroup>
        )

      case 2:
        return (
          <FieldGroup>
            <Field>
              <Label>Sensitivity: {form.parameters.sensitivity}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.parameters.sensitivity}
                onChange={(e) => handleParameterChange('sensitivity', parseInt(e.target.value))}
                className="w-full"
              />
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                How sensitive the detection should be (0 = very strict, 100 = very permissive)
              </Text>
            </Field>
            <Field>
              <Label>Detection Threshold: {form.parameters.threshold}</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={form.parameters.threshold}
                onChange={(e) => handleParameterChange('threshold', parseFloat(e.target.value))}
                className="w-full"
              />
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                Minimum confidence level for detection (0.0 = low confidence, 1.0 = high confidence)
              </Text>
            </Field>
            <Field>
              <Label>Cooldown Period: {form.parameters.cooldownPeriod} seconds</Label>
              <input
                type="range"
                min="60"
                max="3600"
                step="60"
                value={form.parameters.cooldownPeriod}
                onChange={(e) => handleParameterChange('cooldownPeriod', parseInt(e.target.value))}
                className="w-full"
              />
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                Minimum time between alerts for the same detection (prevents spam)
              </Text>
            </Field>
            <Field>
              <Label>Minimum Confidence: {form.parameters.minConfidence}</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={form.parameters.minConfidence}
                onChange={(e) => handleParameterChange('minConfidence', parseFloat(e.target.value))}
                className="w-full"
              />
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                Minimum AI confidence required to trigger alert
              </Text>
            </Field>
          </FieldGroup>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heading level={3}>Detection Zones</Heading>
              <Button>Add Zone</Button>
            </div>
            <Text className="text-zinc-500 dark:text-zinc-400">
              Define specific areas where this detection should be active. If no zones are defined, detection will be active on all assigned cameras.
            </Text>
            {form.zones.length === 0 ? (
              <div className="text-center py-8 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <Text className="text-zinc-500">No zones defined. Detection will be active on all assigned cameras.</Text>
              </div>
            ) : (
              <div className="space-y-2">
                {form.zones.map((zone) => (
                  <div key={zone.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                    <div>
                      <Text className="font-medium">{zone.name}</Text>
                      <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                        {zone.coordinates.length} points
                      </Text>
                    </div>
                    <Button plain>Edit</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <Heading level={3}>Assign Cameras</Heading>
            <Text className="text-zinc-500 dark:text-zinc-400">
              Select which cameras should use this detection scenario.
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_CAMERAS.map(camera => (
                <div
                  key={camera.id}
                  className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                    form.assignedCameras.includes(camera.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                  onClick={() => handleCameraToggle(camera.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={form.assignedCameras.includes(camera.id)}
                      onChange={() => handleCameraToggle(camera.id)}
                    />
                    <div>
                      <Text className="font-medium">{camera.name}</Text>
                      <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                        Camera ID: {camera.id}
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <Heading level={3}>Alert Recipients</Heading>
            <Text className="text-zinc-500 dark:text-zinc-400">
              Select who should receive alerts when this scenario is triggered.
            </Text>
            <div className="space-y-3">
              {MOCK_USERS.map(user => (
                <div
                  key={user.id}
                  className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                    form.alertRecipients.includes(user.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                  onClick={() => handleRecipientToggle(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={form.alertRecipients.includes(user.id)}
                      onChange={() => handleRecipientToggle(user.id)}
                    />
                    <Text className="font-medium">{user.name}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <Heading level={3}>Review Scenario</Heading>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Text className="font-medium mb-2">Basic Information</Text>
                  <div className="space-y-2">
                    <div>
                      <Text className="text-sm text-zinc-500 dark:text-zinc-400">Name</Text>
                      <Text>{form.name}</Text>
                    </div>
                    <div>
                      <Text className="text-sm text-zinc-500 dark:text-zinc-400">Type</Text>
                      <Badge color="blue">{DETECTION_TYPES.find(t => t.value === form.type)?.label}</Badge>
                    </div>
                    <div>
                      <Text className="text-sm text-zinc-500 dark:text-zinc-400">Status</Text>
                      <Badge color={form.enabled ? 'green' : 'zinc'}>
                        {form.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Text className="font-medium mb-2">Parameters</Text>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text className="text-sm">Sensitivity</Text>
                      <Text className="text-sm font-medium">{form.parameters.sensitivity}%</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-sm">Threshold</Text>
                      <Text className="text-sm font-medium">{form.parameters.threshold}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-sm">Cooldown</Text>
                      <Text className="text-sm font-medium">{form.parameters.cooldownPeriod}s</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-sm">Min Confidence</Text>
                      <Text className="text-sm font-medium">{form.parameters.minConfidence}</Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Text className="font-medium mb-2">Assigned Cameras</Text>
                  <div className="space-y-1">
                    {form.assignedCameras.length === 0 ? (
                      <Text className="text-zinc-500">No cameras assigned</Text>
                    ) : (
                      form.assignedCameras.map(cameraId => {
                        const camera = MOCK_CAMERAS.find(c => c.id === cameraId)
                        return (
                          <Text key={cameraId} className="text-sm">
                            {camera?.name || cameraId}
                          </Text>
                        )
                      })
                    )}
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <Text className="font-medium mb-2">Alert Recipients</Text>
                  <div className="space-y-1">
                    {form.alertRecipients.length === 0 ? (
                      <Text className="text-zinc-500">No recipients assigned</Text>
                    ) : (
                      form.alertRecipients.map(userId => {
                        const user = MOCK_USERS.find(u => u.id === userId)
                        return (
                          <Text key={userId} className="text-sm">
                            {user?.name || userId}
                          </Text>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading>Create Detection Scenario</Heading>
          <Text className="text-zinc-500 dark:text-zinc-400">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </Text>
        </div>
        <div className="flex gap-2">
          <Button plain onClick={() => navigate('/configuration')}>
            Cancel
          </Button>
          <Button onClick={() => setShowPreview(true)}>
            Preview
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step.number
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              }`}
            >
              {step.number}
            </div>
            <div className="ml-2">
              <Text className="text-sm font-medium">{step.title}</Text>
              <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                {step.description}
              </Text>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 h-px bg-zinc-200 dark:bg-zinc-800 mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          plain
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSave}>
              Create Scenario
            </Button>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} size="lg">
        <DialogTitle>Scenario Preview</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <Text className="font-medium">{form.name}</Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400">
              {form.description}
            </Text>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text className="text-sm font-medium">Type</Text>
                <Badge color="blue">{DETECTION_TYPES.find(t => t.value === form.type)?.label}</Badge>
              </div>
              <div>
                <Text className="text-sm font-medium">Status</Text>
                <Badge color={form.enabled ? 'green' : 'zinc'}>
                  {form.enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowPreview(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

