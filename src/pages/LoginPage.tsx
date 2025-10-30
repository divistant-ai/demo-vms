import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Button } from '../components/catalyst/button'
import { Field, Label } from '../components/catalyst/fieldset'
import { Input } from '../components/catalyst/input'
import { Text } from '../components/catalyst/text'

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    company: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, always succeed
    localStorage.setItem('user', JSON.stringify({
      id: '1',
      email: formData.email,
      name: formData.fullName || 'Demo User',
      role: 'Administrator',
      company: formData.company || 'VisionCore'
    }))
    
    setIsLoading(false)
    navigate('/')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">VC</span>
          </div>
          <Heading className="text-3xl font-bold text-gray-900 dark:text-white">
            VisionCore
          </Heading>
          <Text className="text-gray-600 dark:text-gray-300 mt-2">
            Intelligent Vision Platform
          </Text>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Heading>
            <Text className="text-gray-600 dark:text-gray-300 mt-2">
              {isLogin 
                ? 'Sign in to your VisionCore account' 
                : 'Get started with VisionCore platform'
              }
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <Field>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="w-full"
                />
              </Field>
            )}

            <Field>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email"
                className="w-full"
              />
            </Field>

            <Field>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter your password"
                className="w-full"
              />
            </Field>

            {!isLogin && (
              <>
                <Field>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Confirm your password"
                    className="w-full"
                  />
                </Field>

                <Field>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className="w-full"
                  />
                </Field>
              </>
            )}

            <Button
              type="submit"
              color="blue"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Text className="text-gray-600 dark:text-gray-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <Button
              plain
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Text className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
              Demo Credentials:
            </Text>
            <Text className="text-xs text-blue-700 dark:text-blue-300">
              Email: demo@visioncore.com<br />
              Password: demo123
            </Text>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 VisionCore. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  )
}