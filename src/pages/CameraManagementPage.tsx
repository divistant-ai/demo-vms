import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/catalyst/table'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Textarea } from '../components/catalyst/textarea'
import { Checkbox } from '../components/catalyst/checkbox'
import { cameraApi } from '../services/api/cameraApi'
import { LoadingState, EmptyState } from '../utils/loadingStates'
import type { Camera } from '../types/camera'
import { useRealtimeData } from '../hooks/useRealtimeData'

export function CameraManagementPage() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    location: 'all'
  })
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    status: 'online',
    zone: 'Downtown',
    address: '',
    resolution: '1920x1080',
    fps: '30',
    codec: 'H.264',
    streamUrl: '',
    scenarios: [] as string[]
  })
  
  // Realtime data streaming
  const realtimeData = useRealtimeData()

  const { data: cameras, isLoading } = useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraApi.getAll(),
    initialData: realtimeData.cameras,
  })
  
  // Use realtime cameras for display
  const displayCameras = realtimeData.cameras || cameras

  const filteredCameras = displayCameras?.filter((camera) => {
    if (filters.search && !camera.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !camera.location.address.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.status !== 'all' && camera.status !== filters.status) return false
    if (filters.location !== 'all' && camera.location.zone !== filters.location) return false
    return true
  })

  const handleEditCamera = (camera: Camera) => {
    setEditingCamera(camera)
    setFormData({
      name: camera.name,
      id: camera.id,
      status: camera.status,
      zone: camera.location.zone,
      address: camera.location.address,
      resolution: camera.specs.resolution,
      fps: camera.specs.fps.toString(),
      codec: camera.specs.codec,
      streamUrl: camera.specs.streamUrl,
      scenarios: camera.activeScenarios || []
    })
    setShowAddDialog(true)
  }

  const handleAddCamera = () => {
    setEditingCamera(null)
    setFormData({
      name: '',
      id: '',
      status: 'online',
      zone: 'Downtown',
      address: '',
      resolution: '1920x1080',
      fps: '30',
      codec: 'H.264',
      streamUrl: '',
      scenarios: []
    })
    setShowAddDialog(true)
  }

  const handleSaveCamera = () => {
    // In a real app, this would make an API call
    console.log('Saving camera:', formData)
    alert(editingCamera ? 'Camera updated successfully!' : 'Camera added successfully!')
    setShowAddDialog(false)
  }

  const handleDeleteCamera = (camera: Camera) => {
    if (confirm(`Are you sure you want to delete ${camera.name}?`)) {
      console.log('Deleting camera:', camera.id)
      alert('Camera deleted successfully!')
    }
  }

  const handleScenarioChange = (scenario: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      scenarios: checked 
        ? [...prev.scenarios, scenario]
        : prev.scenarios.filter(s => s !== scenario)
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green'
      case 'offline': return 'red'
      case 'maintenance': return 'yellow'
      case 'error': return 'red'
      default: return 'zinc'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading>Camera Management</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage and configure your surveillance cameras
          </p>
        </div>
        <Button onClick={handleAddCamera} className="w-full sm:w-auto">Add Camera</Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field>
              <Label>Search</Label>
              <Input 
                placeholder="Search cameras..." 
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Field>
            <Field>
              <Label>Status</Label>
              <Select 
                value={filters.status} 
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
                <option value="error">Error</option>
              </Select>
            </Field>
            <Field>
              <Label>Location</Label>
              <Select 
                value={filters.location} 
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="all">All Locations</option>
                <option value="Downtown">Downtown</option>
                <option value="River Area">River Area</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
              </Select>
            </Field>
          </div>
        </FieldGroup>
      </div>

      {/* Cameras Table */}
      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
        {isLoading ? (
          <LoadingState message="Loading cameras..." />
        ) : filteredCameras && filteredCameras.length > 0 ? (
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>Camera</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Resolution</TableHeader>
                <TableHeader>Last Seen</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCameras.map((camera) => (
                <TableRow key={camera.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-zinc-950 dark:text-white">{camera.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">{camera.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-zinc-950 dark:text-white">{camera.location.address}</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">{camera.location.zone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(camera.status) as any}>{camera.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-950 dark:text-white">{camera.specs.resolution}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{camera.specs.fps} FPS</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-zinc-950 dark:text-white">
                      {new Date(camera.lastSeen).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {new Date(camera.lastSeen).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                      <Button plain onClick={() => handleEditCamera(camera)} className="text-sm">
                        Edit
                      </Button>
                      <Button plain onClick={() => handleDeleteCamera(camera)} className="text-sm text-red-600 dark:text-red-400">
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState 
            title="No cameras found" 
            message="No cameras match your current filters." 
          />
        )}
      </div>

      {/* Add/Edit Camera Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
                {editingCamera ? 'Edit Camera' : 'Add New Camera'}
              </h2>
              <button
                onClick={() => setShowAddDialog(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>Camera Name</Label>
                <Input 
                  placeholder="Enter camera name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Field>
              <Field>
                <Label>Camera ID</Label>
                <Input 
                  placeholder="Enter camera ID"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!editingCamera}
                />
              </Field>
              <Field>
                <Label>Status</Label>
                <Select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="error">Error</option>
                </Select>
              </Field>
              <Field>
                <Label>Zone</Label>
                <Select 
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                >
                  <option value="Downtown">Downtown</option>
                  <option value="River Area">River Area</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                </Select>
              </Field>
              <Field className="sm:col-span-2">
                <Label>Address</Label>
                <Textarea 
                  placeholder="Enter camera address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </Field>
              <Field>
                <Label>Resolution</Label>
                <Select 
                  value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                >
                  <option value="1920x1080">1920x1080 (Full HD)</option>
                  <option value="2560x1440">2560x1440 (2K)</option>
                  <option value="3840x2160">3840x2160 (4K)</option>
                </Select>
              </Field>
              <Field>
                <Label>Frame Rate</Label>
                <Select 
                  value={formData.fps}
                  onChange={(e) => setFormData({ ...formData, fps: e.target.value })}
                >
                  <option value="15">15 FPS</option>
                  <option value="30">30 FPS</option>
                  <option value="60">60 FPS</option>
                </Select>
              </Field>
              <Field>
                <Label>Codec</Label>
                <Select 
                  value={formData.codec}
                  onChange={(e) => setFormData({ ...formData, codec: e.target.value })}
                >
                  <option value="H.264">H.264</option>
                  <option value="H.265">H.265</option>
                  <option value="MJPEG">MJPEG</option>
                </Select>
              </Field>
              <Field>
                <Label>Stream URL</Label>
                <Input 
                  placeholder="Enter stream URL"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                />
              </Field>
            </div>
            
            <div className="mt-6">
              <Label>Active Scenarios</Label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={formData.scenarios.includes('scenario-001')}
                    onChange={(checked) => handleScenarioChange('scenario-001', checked)}
                  />
                  <span className="text-sm text-zinc-950 dark:text-white">Traffic Monitoring (scenario-001)</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={formData.scenarios.includes('scenario-002')}
                    onChange={(checked) => handleScenarioChange('scenario-002', checked)}
                  />
                  <span className="text-sm text-zinc-950 dark:text-white">Flood Detection (scenario-002)</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={formData.scenarios.includes('scenario-003')}
                    onChange={(checked) => handleScenarioChange('scenario-003', checked)}
                  />
                  <span className="text-sm text-zinc-950 dark:text-white">Crowd Detection (scenario-003)</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox 
                    checked={formData.scenarios.includes('scenario-004')}
                    onChange={(checked) => handleScenarioChange('scenario-004', checked)}
                  />
                  <span className="text-sm text-zinc-950 dark:text-white">Intrusion Detection (scenario-004)</span>
                </label>
              </div>
            </div>
          </FieldGroup>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-6">
              <Button plain onClick={() => setShowAddDialog(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleSaveCamera} className="w-full sm:w-auto">
                {editingCamera ? 'Update Camera' : 'Add Camera'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}