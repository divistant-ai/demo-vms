import { useState, useEffect } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Textarea } from '../components/catalyst/textarea'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { Checkbox } from '../components/catalyst/checkbox'
import { useTheme } from '../contexts/ThemeContext'

export function ProfilePage() {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPreferencesDialog, setShowPreferencesDialog] = useState(false)
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState({
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@vms.com',
    role: 'Administrator',
    department: 'IT Security',
    phone: '+62 812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    permissions: [
      'camera_management',
      'user_management',
      'incident_management',
      'analytics_view',
      'system_configuration'
    ],
    preferences: {
      theme: 'light',
      notifications: true,
      emailAlerts: true,
      smsAlerts: false,
      language: 'en'
    }
  })

  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(prev => ({ ...prev, ...parsedUser }))
    }
  }, [])

  const handleSaveProfile = () => {
    // Mock save action
    alert('Profile updated successfully!')
    setShowEditDialog(false)
  }

  const handleChangePassword = () => {
    // Mock password change action
    alert('Password changed successfully!')
    setShowPasswordDialog(false)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    
    // Update user preferences
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        theme: newTheme
      }
    }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const handlePreferenceChange = (key: string, value: any) => {
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        [key]: value
      }
    }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    // If theme is being changed, apply it immediately
    if (key === 'theme') {
      setTheme(value)
    }
  }

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('user', JSON.stringify(user))
    setShowPreferencesDialog(false)
    alert('Preferences updated successfully!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>User Profile</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button plain onClick={() => setShowPasswordDialog(true)}>
            Change Password
          </Button>
          <Button onClick={() => setShowEditDialog(true)}>
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <Heading level={3}>{user.name}</Heading>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
              <Badge color="blue" className="mt-2">{user.role}</Badge>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Department</span>
                <span className="text-sm text-zinc-950 dark:text-white">{user.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Phone</span>
                <span className="text-sm text-zinc-950 dark:text-white">{user.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Last Login</span>
                <span className="text-sm text-zinc-950 dark:text-white">
                  {user.lastLogin.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permissions */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={3} className="mb-4">Permissions</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.permissions.map((permission) => (
                <div key={permission} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-zinc-950 dark:text-white capitalize">
                    {permission.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3}>Preferences</Heading>
              <Button plain onClick={() => setShowPreferencesDialog(true)}>
                Edit Preferences
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-950 dark:text-white">Theme</span>
                <div className="flex items-center gap-2">
                  <Badge color={theme === 'dark' ? 'blue' : 'zinc'}>
                    {theme === 'dark' ? 'Dark' : 'Light'}
                  </Badge>
                  <Button
                    plain
                    onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
                    className="text-xs px-2 py-1"
                  >
                    Switch
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-950 dark:text-white">Notifications</span>
                <Badge color={user.preferences.notifications ? 'green' : 'red'}>
                  {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-950 dark:text-white">Email Alerts</span>
                <Badge color={user.preferences.emailAlerts ? 'green' : 'red'}>
                  {user.preferences.emailAlerts ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-950 dark:text-white">SMS Alerts</span>
                <Badge color={user.preferences.smsAlerts ? 'green' : 'red'}>
                  {user.preferences.smsAlerts ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-950 dark:text-white">Language</span>
                <Badge color="zinc">{user.preferences.language.toUpperCase()}</Badge>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={3} className="mb-4">Recent Activity</Heading>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-950 dark:text-white">Logged in to system</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-950 dark:text-white">Updated camera configuration</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">4 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-950 dark:text-white">Viewed analytics dashboard</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">6 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-950 dark:text-white">Created new incident report</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} size="lg">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>Full Name</Label>
                <Input defaultValue={user.name} />
              </Field>
              <Field>
                <Label>Email</Label>
                <Input type="email" defaultValue={user.email} />
              </Field>
              <Field>
                <Label>Phone</Label>
                <Input defaultValue={user.phone} />
              </Field>
              <Field>
                <Label>Department</Label>
                <Select defaultValue={user.department}>
                  <option value="IT Security">IT Security</option>
                  <option value="Operations">Operations</option>
                  <option value="Management">Management</option>
                  <option value="Support">Support</option>
                </Select>
              </Field>
              <Field className="sm:col-span-2">
                <Label>Bio</Label>
                <Textarea 
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </Field>
            </div>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </Field>
            <Field>
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </Field>
            <Field>
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Preferences Dialog */}
      <Dialog open={showPreferencesDialog} onClose={() => setShowPreferencesDialog(false)} size="lg">
        <DialogTitle>Edit Preferences</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Theme</Label>
              <Select 
                value={theme} 
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </Field>
            
            <Field>
              <Label>Language</Label>
              <Select 
                value={user.preferences.language} 
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </Select>
            </Field>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifications</Label>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Receive system notifications
                  </p>
                </div>
                <Checkbox
                  checked={user.preferences.notifications}
                  onChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Alerts</Label>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Receive alerts via email
                  </p>
                </div>
                <Checkbox
                  checked={user.preferences.emailAlerts}
                  onChange={(checked) => handlePreferenceChange('emailAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Receive alerts via SMS
                  </p>
                </div>
                <Checkbox
                  checked={user.preferences.smsAlerts}
                  onChange={(checked) => handlePreferenceChange('smsAlerts', checked)}
                />
              </div>
            </div>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowPreferencesDialog(false)}>Cancel</Button>
          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
