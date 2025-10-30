export type UserRole = 'admin' | 'manager' | 'officer' | 'analyst' | 'viewer'

export type User = {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  createdAt: Date
  lastLogin?: Date
}



