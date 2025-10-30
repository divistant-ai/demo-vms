import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { CameraManagementPage } from './CameraManagementPage'
import type { DetectionScenario } from '../types/scenario'

// Mock scenarios data
const mockScenarios: Array<DetectionScenario> = [
  {
    id: 'scenario-001',
    name: 'Traffic Congestion Detection',
    description: 'Detect heavy traffic congestion at intersections',
    enabled: true,
    type: 'traffic_monitoring',
    parameters: {
      sensitivity: 75,
      threshold: 80,
      cooldownPeriod: 300,
      minConfidence: 0.85,
    },
    zones: [],
    assignedCameras: ['cam-001', 'cam-003'],
    alertRecipients: ['manager-001'],
    performance: {
      precision: 0.92,
      recall: 0.88,
      f1Score: 0.90,
      falsePositiveRate: 0.08,
    },
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'scenario-002',
    name: 'Flood Detection',
    description: 'Monitor water levels and detect flooding',
    enabled: true,
    type: 'flood_detection',
    parameters: {
      sensitivity: 90,
      threshold: 0.5,
      cooldownPeriod: 600,
      minConfidence: 0.95,
    },
    zones: [],
    assignedCameras: ['cam-002'],
    alertRecipients: ['manager-001', 'officer-002'],
    performance: {
      precision: 0.97,
      recall: 0.94,
      f1Score: 0.95,
      falsePositiveRate: 0.03,
    },
    createdAt: new Date(Date.now() - 86400000 * 14),
    updatedAt: new Date(Date.now() - 86400000 * 2),
  },
]

export function ConfigurationPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'scenarios' | 'cameras' | 'users' | 'crm' | 'communication'>('scenarios')
  const [showScenarioDialog, setShowScenarioDialog] = useState(false)
  const [showCrmDialog, setShowCrmDialog] = useState(false)
  const [showCommDialog, setShowCommDialog] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <Heading>Configuration</Heading>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Manage detection scenarios, cameras, and system settings
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'scenarios'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          Detection Scenarios
        </button>
        <button
          onClick={() => setActiveTab('cameras')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'cameras'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          Camera Management
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
          }`}
        >
          User Management
        </button>
      </div>

      {/* Scenarios Tab */}
      {activeTab === 'scenarios' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Detection Scenarios</h3>
            <div className="flex gap-2">
              <Button onClick={() => navigate('/configuration/scenarios/new')}>
                Create Scenario
              </Button>
            </div>
          </div>
          
          <div className="space-y-3">
            {mockScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-zinc-950 dark:text-white">{scenario.name}</h4>
                      <Badge color={scenario.enabled ? 'green' : 'zinc'}>
                        {scenario.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{scenario.description}</p>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400">Precision:</span>{' '}
                        <span className="font-medium">{(scenario.performance.precision * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400">Recall:</span>{' '}
                        <span className="font-medium">{(scenario.performance.recall * 100).toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400">Cameras:</span>{' '}
                        <span className="font-medium">{scenario.assignedCameras.length}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 dark:text-zinc-400">Sensitivity:</span>{' '}
                        <span className="font-medium">{scenario.parameters.sensitivity}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button plain onClick={() => navigate(`/configuration/scenarios/${scenario.id}/edit`)}>
                      Edit
                    </Button>
                    <Button plain onClick={() => {
                      // Mock toggle enable
                      console.log('Toggle scenario:', scenario.id)
                    }}>
                      {scenario.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cameras Tab */}
      {activeTab === 'cameras' && <CameraManagementPage />}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Button>Add User</Button>
          </div>
          
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">User management interface will be implemented here</p>
          </div>
        </div>
      )}

      {/* Create Scenario Dialog */}
      <Dialog open={showScenarioDialog} onClose={() => setShowScenarioDialog(false)}>
        <DialogTitle>Create Detection Scenario</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Scenario Name</Label>
              <Input placeholder="e.g., Traffic Congestion Detection" />
            </Field>
            <Field>
              <Label>Description</Label>
              <Input placeholder="Describe what this scenario detects" />
            </Field>
            <Field>
              <Label>Detection Type</Label>
              <Select>
                <option>Traffic Monitoring</option>
                <option>Flood Detection</option>
                <option>Intrusion Detection</option>
                <option>Crowd Detection</option>
              </Select>
            </Field>
            <Field>
              <Label>Sensitivity</Label>
              <Input type="number" placeholder="75" />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowScenarioDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowScenarioDialog(false)}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* CRM Configuration Dialog */}
      <Dialog open={showCrmDialog} onClose={() => setShowCrmDialog(false)} size="lg">
        <DialogTitle>Configure CRM Integration</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>CRM Provider</Label>
              <Select>
                <option value="salesforce">Salesforce</option>
                <option value="hubspot">HubSpot</option>
                <option value="custom">Custom API</option>
              </Select>
            </Field>
            <Field>
              <Label>API Endpoint</Label>
              <Input type="url" placeholder="https://api.example.com/v1" />
            </Field>
            <Field>
              <Label>API Key</Label>
              <Input type="password" placeholder="Enter API key" />
            </Field>
            <Field>
              <Label>Sync Settings</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-zinc-950 dark:text-white">Sync incidents to CRM</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-zinc-950 dark:text-white">Create tickets for alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-zinc-950 dark:text-white">Update customer records</span>
                </label>
              </div>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowCrmDialog(false)}>Cancel</Button>
          <Button>Save Configuration</Button>
        </DialogActions>
      </Dialog>

      {/* Communication Tools Dialog */}
      <Dialog open={showCommDialog} onClose={() => setShowCommDialog(false)} size="lg">
        <DialogTitle>Add Communication Channel</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Channel Type</Label>
              <Select>
                <option value="email">Email</option>
                <option value="slack">Slack</option>
                <option value="sms">SMS</option>
                <option value="webhook">Webhook</option>
              </Select>
            </Field>
            <Field>
              <Label>Channel Name</Label>
              <Input placeholder="e.g., Emergency Alerts" />
            </Field>
            <Field>
              <Label>Configuration</Label>
              <textarea 
                placeholder="Enter channel-specific configuration..." 
                rows={4}
                className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              />
            </Field>
            <Field>
              <Label>Alert Types</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-zinc-950 dark:text-white">Critical Alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-zinc-950 dark:text-white">Warning Alerts</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-zinc-950 dark:text-white">Info Notifications</span>
                </label>
              </div>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowCommDialog(false)}>Cancel</Button>
          <Button>Add Channel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
