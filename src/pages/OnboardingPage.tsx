import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'
import { industryProfiles } from '../data/industryProfiles'
import type { IndustryType, UseCase } from '../types/industry'

export function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'welcome' | 'industry' | 'use-cases' | 'organization' | 'complete'>('welcome')
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null)
  const [selectedUseCases, setSelectedUseCases] = useState<UseCase[]>([])
  const [organizationData, setOrganizationData] = useState({
    size: 'small' as 'individual' | 'small' | 'medium' | 'large' | 'enterprise',
    locations: 1,
    cameras: 5,
    users: 3,
  })

  const handleIndustrySelect = (industry: IndustryType) => {
    setSelectedIndustry(industry)
    const profile = industryProfiles.find(p => p.type === industry)
    if (profile) {
      setSelectedUseCases(profile.useCases.slice(0, 3)) // Pre-select top 3 use cases
    }
  }

  const toggleUseCase = (useCase: UseCase) => {
    setSelectedUseCases(prev =>
      prev.includes(useCase)
        ? prev.filter(uc => uc !== useCase)
        : [...prev, useCase]
    )
  }

  const handleComplete = () => {
    // Save onboarding data to localStorage
    const onboardingData = {
      industry: selectedIndustry,
      useCases: selectedUseCases,
      organization: organizationData,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem('onboarding', JSON.stringify(onboardingData))
    localStorage.setItem('industryProfile', selectedIndustry || 'personal')
    
    // Navigate to dashboard
    navigate('/')
  }

  const selectedProfile = industryProfiles.find(p => p.type === selectedIndustry)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {['welcome', 'industry', 'use-cases', 'organization', 'complete'].map((s, idx) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  ['welcome', 'industry', 'use-cases', 'organization', 'complete'].indexOf(step) >= idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {idx + 1}
                </div>
                {idx < 4 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    ['welcome', 'industry', 'use-cases', 'organization', 'complete'].indexOf(step) > idx
                      ? 'bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Welcome Step */}
        {step === 'welcome' && (
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">👋</div>
            <Heading className="text-4xl mb-4">Welcome to VisionCore VMS</Heading>
            <Text className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Let's personalize your experience based on your industry and needs
            </Text>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <Text className="text-lg mb-6">
                We'll ask you a few questions to:
              </Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <Text className="font-semibold mb-2">Customize Dashboard</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    See metrics that matter to your industry
                  </Text>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <Text className="font-semibold mb-2">Quick Setup</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Pre-configured scenarios for your use case
                  </Text>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <Text className="font-semibold mb-2">Smart Insights</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Industry-specific analytics and reports
                  </Text>
                </div>
              </div>
            </div>
            <Button color="blue" className="px-8 py-3 text-lg" onClick={() => setStep('industry')}>
              Get Started
            </Button>
            <div className="mt-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Industry Selection Step */}
        {step === 'industry' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Heading className="text-3xl mb-4">What's your industry?</Heading>
              <Text className="text-lg text-gray-600 dark:text-gray-400">
                Choose the industry that best describes your organization
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {industryProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleIndustrySelect(profile.type)}
                  className={`p-6 rounded-xl border-2 transition-all text-left ${
                    selectedIndustry === profile.type
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-3">{profile.icon}</div>
                  <Heading level={3} className="mb-2">{profile.name}</Heading>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {profile.description}
                  </Text>
                  <div className="flex flex-wrap gap-2">
                    {profile.recommendedFeatures.slice(0, 3).map((feature) => (
                      <Badge key={feature} color="blue" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button color="zinc" onClick={() => setStep('welcome')}>
                Back
              </Button>
              <Button
                color="blue"
                onClick={() => setStep('use-cases')}
                disabled={!selectedIndustry}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Use Cases Step */}
        {step === 'use-cases' && selectedProfile && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-5xl mb-4">{selectedProfile.icon}</div>
              <Heading className="text-3xl mb-4">What are your primary use cases?</Heading>
              <Text className="text-lg text-gray-600 dark:text-gray-400">
                Select all that apply for {selectedProfile.name}
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {selectedProfile.useCases.map((useCase) => (
                <button
                  key={useCase}
                  onClick={() => toggleUseCase(useCase)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedUseCases.includes(useCase)
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedUseCases.includes(useCase)
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedUseCases.includes(useCase) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <Text className="font-medium">
                      {useCase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button color="zinc" onClick={() => setStep('industry')}>
                Back
              </Button>
              <Button
                color="blue"
                onClick={() => setStep('organization')}
                disabled={selectedUseCases.length === 0}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Organization Details Step */}
        {step === 'organization' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Heading className="text-3xl mb-4">Tell us about your organization</Heading>
              <Text className="text-lg text-gray-600 dark:text-gray-400">
                This helps us recommend the right plan and features
              </Text>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <div className="space-y-8">
                {/* Organization Size */}
                <div>
                  <label className="block text-sm font-medium mb-3">Organization Size</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { value: 'individual', label: 'Individual', icon: '👤' },
                      { value: 'small', label: 'Small (1-10)', icon: '👥' },
                      { value: 'medium', label: 'Medium (11-50)', icon: '👨‍👩‍👧‍👦' },
                      { value: 'large', label: 'Large (51-200)', icon: '🏢' },
                      { value: 'enterprise', label: 'Enterprise (200+)', icon: '🏛️' },
                    ].map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setOrganizationData({ ...organizationData, size: size.value as any })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          organizationData.size === size.value
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                        }`}
                      >
                        <div className="text-2xl mb-1">{size.icon}</div>
                        <Text className="text-xs font-medium">{size.label}</Text>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Locations */}
                <div>
                  <label className="block text-sm font-medium mb-3">Number of Locations</label>
                  <input
                    type="number"
                    min="1"
                    value={organizationData.locations}
                    onChange={(e) => setOrganizationData({ ...organizationData, locations: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Cameras */}
                <div>
                  <label className="block text-sm font-medium mb-3">Estimated Number of Cameras</label>
                  <input
                    type="number"
                    min="1"
                    value={organizationData.cameras}
                    onChange={(e) => setOrganizationData({ ...organizationData, cameras: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Number of Users */}
                <div>
                  <label className="block text-sm font-medium mb-3">Number of Users</label>
                  <input
                    type="number"
                    min="1"
                    value={organizationData.users}
                    onChange={(e) => setOrganizationData({ ...organizationData, users: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button color="zinc" onClick={() => setStep('use-cases')}>
                Back
              </Button>
              <Button color="blue" onClick={() => setStep('complete')}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && selectedProfile && (
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">🎉</div>
            <Heading className="text-4xl mb-4">You're all set!</Heading>
            <Text className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              We've personalized your dashboard for {selectedProfile.name}
            </Text>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <Text className="text-sm text-gray-500 mb-2">Industry</Text>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedProfile.icon}</span>
                    <Text className="font-semibold">{selectedProfile.name}</Text>
                  </div>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 mb-2">Use Cases</Text>
                  <Text className="font-semibold">{selectedUseCases.length} selected</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 mb-2">Organization Size</Text>
                  <Text className="font-semibold capitalize">{organizationData.size}</Text>
                </div>
                <div>
                  <Text className="text-sm text-gray-500 mb-2">Cameras</Text>
                  <Text className="font-semibold">{organizationData.cameras} cameras</Text>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Text className="font-semibold mb-2">What's next?</Text>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                  <li>✓ Dashboard customized for your industry</li>
                  <li>✓ Pre-configured detection scenarios</li>
                  <li>✓ Industry-specific metrics and KPIs</li>
                  <li>✓ Recommended integrations ready</li>
                </ul>
              </div>
            </div>

            <Button color="blue" className="px-8 py-3 text-lg" onClick={handleComplete}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

