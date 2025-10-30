import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/catalyst/table'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Textarea } from '../components/catalyst/textarea'
import { Text } from '../components/catalyst/text'
import { AdvancedFilters } from '../components/AdvancedFilters'
import { useSavedFilters } from '../hooks/useSavedFilters'
import { incidentApi } from '../services/api/incidentApi'
import { format } from 'date-fns'
import { LoadingState, EmptyState } from '../utils/loadingStates'
import { exportIncidentsToCSV } from '../utils/exportUtils'
import { useRealtimeData } from '../hooks/useRealtimeData'

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical':
      return 'red'
    case 'high':
      return 'orange'
    case 'medium':
      return 'yellow'
    case 'low':
      return 'green'
    default:
      return 'zinc'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'closed':
      return 'green'
    case 'in_progress':
      return 'blue'
    case 'acknowledged':
      return 'yellow'
    default:
      return 'zinc'
  }
}

export function IncidentsPage() {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    severity: 'all',
    dateFrom: '',
    dateTo: '',
  })
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { savedFilters, saveFilter, loadFilter, deleteFilter } = useSavedFilters()
  
  // Realtime data streaming - data mengalir tanpa reload
  const realtimeData = useRealtimeData()

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => incidentApi.getAll(),
    initialData: realtimeData.incidents,
  })
  
  // Use realtime incidents for display
  const displayIncidents = realtimeData.incidents || incidents

  const handleCreateIncident = () => {
    setShowCreateDialog(true)
  }

  const handleSaveIncident = () => {
    alert('Incident created successfully! (Demo)')
    setShowCreateDialog(false)
  }

  const filteredIncidents = displayIncidents?.filter((incident) => {
    if (filters.search && !incident.location.toLowerCase().includes(filters.search.toLowerCase()) &&
        !incident.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.type !== 'all' && incident.type !== filters.type) return false
    if (filters.status !== 'all' && incident.status !== filters.status) return false
    if (filters.severity !== 'all' && incident.severity !== filters.severity) return false
    
    if (filters.dateFrom) {
      const incidentDate = new Date(incident.timestamp)
      const fromDate = new Date(filters.dateFrom)
      if (incidentDate < fromDate) return false
    }
    
    if (filters.dateTo) {
      const incidentDate = new Date(incident.timestamp)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      if (incidentDate > toDate) return false
    }
    
    return true
  })

  const filterFields = [
    {
      key: 'search',
      label: 'Search',
      type: 'text' as const,
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'traffic_monitoring', label: 'Traffic Monitoring' },
        { value: 'flood_detection', label: 'Flood Detection' },
        { value: 'intrusion', label: 'Intrusion' },
        { value: 'crowd_detection', label: 'Crowd Detection' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'acknowledged', label: 'Acknowledged' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'closed', label: 'Closed' },
      ],
    },
    {
      key: 'severity',
      label: 'Severity',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Severity' },
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    {
      key: 'dateFrom',
      label: 'From Date',
      type: 'date' as const,
    },
    {
      key: 'dateTo',
      label: 'To Date',
      type: 'date' as const,
    },
  ]

  const handleLoadFilter = (filterId: string) => {
    const filterData = loadFilter(filterId)
    setFilters(prev => ({ ...prev, ...filterData }))
  }

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Incidents</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            View and manage all security incidents
          </p>
        </div>
        <div className="flex gap-2">
          <Button plain onClick={() => filteredIncidents && exportIncidentsToCSV(filteredIncidents)}>
            Export CSV
          </Button>
          <Button onClick={handleCreateIncident}>Create Incident</Button>
        </div>
      </div>

          {/* Advanced Filters */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onSaveFilter={saveFilter}
              onLoadFilter={handleLoadFilter}
              onDeleteFilter={deleteFilter}
              savedFilters={savedFilters}
              filterFields={filterFields}
            />
          </div>

      {isLoading ? (
        <LoadingState message="Loading incidents..." />
      ) : filteredIncidents && filteredIncidents.length > 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>Time</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Location</TableHeader>
                <TableHeader>Severity</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id} href={`/incidents/${incident.id}`}>
                  <TableCell>
                    {format(new Date(incident.timestamp), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Badge color="zinc">{incident.type.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>
                    <Badge color={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(incident.status)}>{incident.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/incidents/${incident.id}`}
                      className="text-[#0066cc] hover:text-[#0052a3] dark:text-[#3399ff]"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filteredIncidents?.length === 0 ? (
        <EmptyState 
          title="No incidents found" 
          message="No incidents match your current filters. Try adjusting your search criteria."
        />
      ) : null}

      {/* Create Incident Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} size="lg">
        <DialogTitle>Create New Incident</DialogTitle>
        <DialogBody>
          <Text className="mb-4">Report a new incident for tracking and resolution.</Text>
          <FieldGroup>
            <Field>
              <Label>Incident Type</Label>
              <Select>
                <option>Traffic Monitoring</option>
                <option>Flood Detection</option>
                <option>Intrusion</option>
                <option>Crowd Detection</option>
                <option>Safety & HSE</option>
              </Select>
            </Field>
            <Field>
              <Label>Severity</Label>
              <Select>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </Select>
            </Field>
            <Field>
              <Label>Location</Label>
              <Input placeholder="Enter incident location" />
            </Field>
            <Field>
              <Label>Description</Label>
              <Textarea rows={4} placeholder="Describe the incident..." />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveIncident}>Create Incident</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
