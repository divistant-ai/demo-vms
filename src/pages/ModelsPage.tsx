import { useState } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/catalyst/table'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Select } from '../components/catalyst/select'
import { Text } from '../components/catalyst/text'
// import { LoadingState, EmptyState } from '../utils/loadingStates'

export interface AIModel {
  id: string
  name: string
  version: string
  type: 'detection' | 'classification' | 'tracking' | 'analytics'
  status: 'active' | 'inactive' | 'training' | 'error'
  accuracy: number
  performance: 'high' | 'medium' | 'low'
  lastUpdated: Date
  description: string
  useCases: string[]
  bestPractices: string[]
}

const mockModels: AIModel[] = [
  {
    id: 'model-001',
    name: 'YOLOv8 Traffic Detection',
    version: '8.0.0',
    type: 'detection',
    status: 'active',
    accuracy: 94.5,
    performance: 'high',
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    description: 'Advanced object detection model for traffic monitoring',
    useCases: ['Vehicle counting', 'Speed estimation', 'Lane detection'],
    bestPractices: ['Use 4K resolution', 'Good lighting conditions', 'Regular retraining']
  },
  {
    id: 'model-002',
    name: 'Flood Detection CNN',
    version: '2.1.0',
    type: 'detection',
    status: 'active',
    accuracy: 89.2,
    performance: 'high',
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    description: 'Convolutional neural network for flood level detection',
    useCases: ['Water level monitoring', 'Flood risk assessment', 'Drainage analysis'],
    bestPractices: ['Install at water level', 'Clean camera lens', 'Monitor during rain']
  },
  {
    id: 'model-003',
    name: 'Crowd Density Estimator',
    version: '1.5.0',
    type: 'analytics',
    status: 'active',
    accuracy: 91.8,
    performance: 'high',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    description: 'Real-time crowd density estimation and analysis',
    useCases: ['Crowd management', 'Capacity monitoring', 'Safety alerts'],
    bestPractices: ['Overhead camera angle', 'Consistent lighting', 'Regular calibration']
  },
  {
    id: 'model-004',
    name: 'Person Re-identification',
    version: '3.2.0',
    type: 'tracking',
    status: 'training',
    accuracy: 87.3,
    performance: 'medium',
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000),
    description: 'Multi-camera person tracking and re-identification',
    useCases: ['Security monitoring', 'Person tracking', 'Behavior analysis'],
    bestPractices: ['Multiple camera angles', 'Good resolution', 'Consistent lighting']
  },
  {
    id: 'model-005',
    name: 'Anomaly Detection LSTM',
    version: '1.0.0',
    type: 'analytics',
    status: 'error',
    accuracy: 0,
    performance: 'low',
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    description: 'Long short-term memory network for anomaly detection',
    useCases: ['Unusual behavior detection', 'Security alerts', 'Pattern analysis'],
    bestPractices: ['Sufficient training data', 'Regular model updates', 'Quality data preprocessing']
  }
]

function getStatusColor(status: string): 'green' | 'yellow' | 'red' | 'blue' | 'zinc' {
  switch (status) {
    case 'active': return 'green'
    case 'training': return 'blue'
    case 'error': return 'red'
    case 'inactive': return 'zinc'
    default: return 'zinc'
  }
}

function getPerformanceColor(performance: string): 'green' | 'yellow' | 'red' {
  switch (performance) {
    case 'high': return 'green'
    case 'medium': return 'yellow'
    case 'low': return 'red'
    default: return 'green'
  }
}

export function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null)
  const [showModelDialog, setShowModelDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    performance: 'all'
  })

  const filteredModels = mockModels.filter(model => {
    if (filter.type !== 'all' && model.type !== filter.type) return false
    if (filter.status !== 'all' && model.status !== filter.status) return false
    if (filter.performance !== 'all' && model.performance !== filter.performance) return false
    return true
  })

  const handleModelClick = (model: AIModel) => {
    setSelectedModel(model)
    setShowModelDialog(true)
  }

  const handleConfigureModel = (model: AIModel) => {
    setSelectedModel(model)
    setShowModelDialog(true)
  }

  const handleAddNewModel = () => {
    setShowAddDialog(true)
  }

  const handleSaveNewModel = () => {
    alert('New AI Model added successfully! (Demo)')
    setShowAddDialog(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>AI Models Management</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage and configure AI models for video analytics
          </p>
        </div>
        <Button onClick={handleAddNewModel}>Add New Model</Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field>
              <Label>Model Type</Label>
              <Select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                <option value="all">All Types</option>
                <option value="detection">Detection</option>
                <option value="classification">Classification</option>
                <option value="tracking">Tracking</option>
                <option value="analytics">Analytics</option>
              </Select>
            </Field>
            <Field>
              <Label>Status</Label>
              <Select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="training">Training</option>
                <option value="error">Error</option>
              </Select>
            </Field>
            <Field>
              <Label>Performance</Label>
              <Select value={filter.performance} onChange={(e) => setFilter({ ...filter, performance: e.target.value })}>
                <option value="all">All Performance</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </Field>
          </div>
        </FieldGroup>
      </div>

      {/* Models Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeader>Model Name</TableHeader>
              <TableHeader>Version</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Accuracy</TableHeader>
              <TableHeader>Performance</TableHeader>
              <TableHeader>Last Updated</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredModels.map((model) => (
              <TableRow key={model.id} onClick={() => handleModelClick(model)} className="cursor-pointer">
                <TableCell>
                  <div>
                    <div className="font-medium text-zinc-950 dark:text-white">{model.name}</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">{model.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color="blue">{model.version}</Badge>
                </TableCell>
                <TableCell>
                  <Badge color="zinc">{model.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge color={getStatusColor(model.status)}>{model.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-zinc-950 dark:text-white">
                    {model.accuracy > 0 ? `${model.accuracy}%` : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color={getPerformanceColor(model.performance)}>{model.performance}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400">
                    {model.lastUpdated.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button plain onClick={() => handleConfigureModel(model)}>Configure</Button>
                    <Button plain>Test</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Model Detail Dialog */}
      <Dialog open={showModelDialog} onClose={() => setShowModelDialog(false)} size="xl">
        <DialogTitle>Model Details: {selectedModel?.name}</DialogTitle>
        <DialogBody>
          {selectedModel && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400">Version</Text>
                  <Text className="font-medium">{selectedModel.version}</Text>
                </div>
                <div>
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400">Type</Text>
                  <Badge color="zinc">{selectedModel.type}</Badge>
                </div>
                <div>
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400">Status</Text>
                  <Badge color={getStatusColor(selectedModel.status)}>{selectedModel.status}</Badge>
                </div>
                <div>
                  <Text className="text-sm text-zinc-500 dark:text-zinc-400">Accuracy</Text>
                  <Text className="font-medium">{selectedModel.accuracy}%</Text>
                </div>
              </div>

              {/* Description */}
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Description</Text>
                <Text className="mt-1">{selectedModel.description}</Text>
              </div>

              {/* Use Cases */}
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Use Cases</Text>
                <div className="flex flex-wrap gap-2">
                  {selectedModel.useCases.map((useCase, index) => (
                    <Badge key={index} color="blue">{useCase}</Badge>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Best Practices</Text>
                <ul className="list-disc list-inside space-y-1">
                  {selectedModel.bestPractices.map((practice, index) => (
                    <li key={index} className="text-sm text-zinc-950 dark:text-white">{practice}</li>
                  ))}
                </ul>
              </div>

              {/* Performance Metrics */}
              <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <Text className="text-sm font-medium text-zinc-950 dark:text-white mb-3">Performance Metrics</Text>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedModel.accuracy}%</div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedModel.performance === 'high' ? '95%' : 
                       selectedModel.performance === 'medium' ? '75%' : '45%'}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Performance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {selectedModel.status === 'active' ? '100%' : '0%'}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowModelDialog(false)}>Close</Button>
          <Button onClick={() => {
            // Mock configuration action
            alert(`Configuring ${selectedModel?.name} v${selectedModel?.version}`)
            setShowModelDialog(false)
          }}>
            Configure Model
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Model Dialog */}
      <Dialog open={showAddDialog} onClose={() => setShowAddDialog(false)} size="lg">
        <DialogTitle>Add New AI Model</DialogTitle>
        <DialogBody>
          <div className="space-y-4">
            <Text>Configure a new AI model for your video analytics system.</Text>
            <FieldGroup>
              <Field>
                <Label>Model Name</Label>
                <Select>
                  <option>YOLOv8 Object Detection</option>
                  <option>ResNet Classification</option>
                  <option>DeepSORT Tracking</option>
                  <option>Custom Model</option>
                </Select>
              </Field>
              <Field>
                <Label>Version</Label>
                <Select>
                  <option>Latest (Recommended)</option>
                  <option>8.0.0</option>
                  <option>7.5.2</option>
                  <option>7.0.0</option>
                </Select>
              </Field>
              <Field>
                <Label>Use Case</Label>
                <Select>
                  <option>Traffic Monitoring</option>
                  <option>Flood Detection</option>
                  <option>Crowd Analysis</option>
                  <option>Security & Intrusion</option>
                  <option>Safety & HSE</option>
                </Select>
              </Field>
            </FieldGroup>
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNewModel}>Add Model</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
