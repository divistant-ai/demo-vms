import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'
import { industryProfiles, getIndustryProfile } from '../data/industryProfiles'
import type { IndustryType } from '../types/industry'

export function IndustryProfilePage() {
  const navigate = useNavigate()
  const [currentIndustry, setCurrentIndustry] = useState<IndustryType | null>(null)
  const [isChanging, setIsChanging] = useState(false)

  useEffect(() => {
    const savedIndustry = localStorage.getItem('industryProfile') as IndustryType
    if (savedIndustry) {
      setCurrentIndustry(savedIndustry)
    }
  }, [])

  const handleChangeIndustry = (industry: IndustryType) => {
    localStorage.setItem('industryProfile', industry)
    setCurrentIndustry(industry)
    setIsChanging(false)
    
    // Show success message
    alert(`Industry profile changed to ${getIndustryProfile(industry)?.name}. Dashboard will be updated.`)
    
    // Reload to apply changes
    window.location.reload()
  }

  const currentProfile = currentIndustry ? getIndustryProfile(currentIndustry) : null

  return (
    <div className="space-y-8">
      <div>
        <Heading>Industry Profile</Heading>
        <Text className="mt-2">
          Manage your industry profile and customize your experience
        </Text>
      </div>

      {/* Current Profile */}
      {currentProfile && !isChanging && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{currentProfile.icon}</div>
              <div>
                <Heading level={2}>{currentProfile.name}</Heading>
                <Text className="text-gray-600 dark:text-gray-400">{currentProfile.description}</Text>
              </div>
            </div>
            <Button color="blue" onClick={() => setIsChanging(true)}>
              Change Industry
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Use Cases */}
            <div>
              <Text className="font-semibold mb-3">Primary Use Cases</Text>
              <div className="space-y-2">
                {currentProfile.useCases.map((useCase) => (
                  <div key={useCase} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Text className="text-sm">
                      {useCase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Features */}
            <div>
              <Text className="font-semibold mb-3">Recommended Features</Text>
              <div className="flex flex-wrap gap-2">
                {currentProfile.recommendedFeatures.map((feature) => (
                  <Badge key={feature} color="blue">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* KPI Metrics */}
            <div>
              <Text className="font-semibold mb-3">Key Performance Indicators</Text>
              <div className="space-y-2">
                {currentProfile.kpiMetrics.map((kpi) => (
                  <div key={kpi.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                    <Text className="font-medium text-sm">{kpi.name}</Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400">{kpi.description}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <Text className="font-semibold mb-3">Available Integrations</Text>
              <div className="flex flex-wrap gap-2">
                {currentProfile.integrations.map((integration) => (
                  <Badge key={integration} color="green">
                    {integration.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Default Scenarios */}
          <div className="mt-8">
            <Text className="font-semibold mb-4">Pre-configured Scenarios</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentProfile.defaultScenarios.map((scenario) => (
                <div key={scenario.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Text className="font-medium">{scenario.name}</Text>
                    <Badge color={scenario.sensitivity === 'high' ? 'red' : scenario.sensitivity === 'medium' ? 'amber' : 'zinc'}>
                      {scenario.sensitivity}
                    </Badge>
                  </div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {scenario.description}
                  </Text>
                  <div className="flex flex-wrap gap-1">
                    {scenario.actions.map((action) => (
                      <Badge key={action} color="zinc" className="text-xs">
                        {action.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Change Industry */}
      {isChanging && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Heading level={2}>Select New Industry Profile</Heading>
            <Button color="zinc" onClick={() => setIsChanging(false)}>
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleChangeIndustry(profile.type)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  currentIndustry === profile.type
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
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
        </div>
      )}

      {/* No Profile Set */}
      {!currentProfile && !isChanging && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <Heading level={2} className="mb-4">No Industry Profile Set</Heading>
          <Text className="text-gray-600 dark:text-gray-400 mb-6">
            Set up your industry profile to customize your dashboard and get relevant features
          </Text>
          <Button color="blue" onClick={() => navigate('/onboarding')}>
            Complete Onboarding
          </Button>
        </div>
      )}
    </div>
  )
}


