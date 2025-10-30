import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/catalyst/table'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { AdvancedFilters } from '../components/AdvancedFilters'
import { useSavedFilters } from '../hooks/useSavedFilters'
import { LoadingState, EmptyState } from '../utils/loadingStates'
import { format } from 'date-fns'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  permissions: string[]
}

// Mock users data
const mockUsers: User[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@vms.local',
    role: 'admin',
    status: 'active',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    permissions: ['all']
  },
  {
    id: 'user-002',
    name: 'John Operator',
    email: 'john@vms.local',
    role: 'operator',
    status: 'active',
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    permissions: ['view_cameras', 'manage_incidents', 'view_alerts']
  },
  {
    id: 'user-003',
    name: 'Jane Viewer',
    email: 'jane@vms.local',
    role: 'viewer',
    status: 'active',
    lastLogin: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    permissions: ['view_cameras', 'view_incidents']
  },
  {
    id: 'user-004',
    name: 'Bob Manager',
    email: 'bob@vms.local',
    role: 'operator',
    status: 'inactive',
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    permissions: ['view_cameras', 'manage_incidents', 'view_alerts', 'manage_users']
  },
  {
    id: 'user-005',
    name: 'Alice Security',
    email: 'alice@vms.local',
    role: 'operator',
    status: 'suspended',
    lastLogin: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    permissions: ['view_cameras', 'view_incidents', 'view_alerts']
  }
]

function getRoleColor(role: string): 'red' | 'blue' | 'green' | 'zinc' {
  switch (role) {
    case 'admin':
      return 'red'
    case 'operator':
      return 'blue'
    case 'viewer':
      return 'green'
    default:
      return 'zinc'
  }
}

function getStatusColor(status: string): 'green' | 'yellow' | 'red' | 'zinc' {
  switch (status) {
    case 'active':
      return 'green'
    case 'inactive':
      return 'yellow'
    case 'suspended':
      return 'red'
    default:
      return 'zinc'
  }
}

export function UserManagementPage() {
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })

  const [showUserDialog, setShowUserDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'viewer' as 'admin' | 'operator' | 'viewer',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    permissions: [] as string[]
  })

  const { savedFilters, saveFilter, loadFilter, deleteFilter } = useSavedFilters()

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      role: 'viewer',
      status: 'active',
      permissions: []
    })
  }

  const handleSaveUser = () => {
    // Mock save user
    console.log('Saving user:', form)
    setShowUserDialog(false)
    resetForm()
    setEditingUser(null)
  }

  const handleUpdateUser = () => {
    // Mock update user
    console.log('Updating user:', editingUser, form)
    setShowUserDialog(false)
    resetForm()
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      console.log('Deleting user:', userId)
    }
  }

  // Mock query - in real app, this would fetch from API
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockUsers
    },
  })

  const filteredUsers = users?.filter((user) => {
    if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.role !== 'all' && user.role !== filters.role) return false
    if (filters.status !== 'all' && user.status !== filters.status) return false
    
    if (filters.dateFrom) {
      const userDate = new Date(user.createdAt)
      const fromDate = new Date(filters.dateFrom)
      if (userDate < fromDate) return false
    }
    
    if (filters.dateTo) {
      const userDate = new Date(user.createdAt)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      if (userDate > toDate) return false
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
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Roles' },
        { value: 'admin', label: 'Admin' },
        { value: 'operator', label: 'Operator' },
        { value: 'viewer', label: 'Viewer' },
      ],
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'suspended', label: 'Suspended' },
      ],
    },
    {
      key: 'dateFrom',
      label: 'Created From',
      type: 'date' as const,
    },
    {
      key: 'dateTo',
      label: 'Created To',
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

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers?.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers?.map(user => user.id) || [])
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on users:`, selectedUsers)
    // Implement bulk actions
    setSelectedUsers([])
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions
    })
    setShowUserDialog(true)
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    resetForm()
    setShowUserDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Heading>User Management</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {selectedUsers.length > 0 && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button plain onClick={() => handleBulkAction('activate')} className="w-full sm:w-auto">
                Activate ({selectedUsers.length})
              </Button>
              <Button plain onClick={() => handleBulkAction('suspend')} className="w-full sm:w-auto">
                Suspend ({selectedUsers.length})
              </Button>
              <Button plain onClick={() => handleBulkAction('delete')} className="text-red-600 hover:text-red-700 w-full sm:w-auto">
                Delete ({selectedUsers.length})
              </Button>
            </div>
          )}
          <Button onClick={handleCreateUser} className="w-full sm:w-auto">
            Create User
          </Button>
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
        <LoadingState message="Loading users..." />
      ) : filteredUsers && filteredUsers.length > 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Email</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Last Login</TableHeader>
                <TableHeader>Created</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-zinc-950 dark:text-white">{user.name}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">ID: {user.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge color={getRoleColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge color={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? format(new Date(user.lastLogin), 'MMM dd, yyyy HH:mm') : 'Never'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                      <Button plain onClick={() => handleEditUser(user)} className="text-sm">
                        Edit
                      </Button>
                      <Button plain className="text-red-600 hover:text-red-700 text-sm" onClick={() => handleDeleteUser(user.id)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState
          title="No users found"
          message="No users match your current filters. Try adjusting your search criteria."
        />
      )}

      {/* User Dialog */}
      <Dialog open={showUserDialog} onClose={() => setShowUserDialog(false)} size="lg">
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Create User'}
        </DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Name</Label>
              <Input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter user name"
              />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </Field>
            <Field>
              <Label>Role</Label>
              <Select 
                value={form.role} 
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'operator' | 'viewer' }))}
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="viewer">Viewer</option>
              </Select>
            </Field>
            <Field>
              <Label>Status</Label>
              <Select 
                value={form.status}
                onChange={(e) => setForm((prev: typeof form) => ({ ...prev, status: e.target.value as 'active' | 'inactive' | 'suspended' }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </Select>
            </Field>
            <Field>
              <Label>Permissions</Label>
              <div className="space-y-2">
                {[
                  { key: 'view_cameras', label: 'View Cameras' },
                  { key: 'manage_cameras', label: 'Manage Cameras' },
                  { key: 'view_incidents', label: 'View Incidents' },
                  { key: 'manage_incidents', label: 'Manage Incidents' },
                  { key: 'view_alerts', label: 'View Alerts' },
                  { key: 'manage_alerts', label: 'Manage Alerts' },
                  { key: 'view_analytics', label: 'View Analytics' },
                  { key: 'manage_users', label: 'Manage Users' },
                  { key: 'system_config', label: 'System Configuration' },
                ].map((permission) => (
                  <label key={permission.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.permissions.includes(permission.key)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm((prev: typeof form) => ({ ...prev, permissions: [...prev.permissions, permission.key] }))
                        } else {
                          setForm((prev: typeof form) => ({ ...prev, permissions: prev.permissions.filter((p: string) => p !== permission.key) }))
                        }
                      }}
                      className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-zinc-950 dark:text-white">
                      {permission.label}
                    </span>
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button plain onClick={() => {
            setShowUserDialog(false)
            resetForm()
            setEditingUser(null)
          }} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={editingUser ? handleUpdateUser : handleSaveUser} className="w-full sm:w-auto">
            {editingUser ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
