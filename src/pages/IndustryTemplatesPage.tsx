import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heading } from '../components/catalyst/heading'
import { Text } from '../components/catalyst/text'
import { Button } from '../components/catalyst/button'
import { Badge } from '../components/catalyst/badge'
import { industryTemplates } from '../data/industryProfiles'
import type { IndustryTemplate } from '../types/industry'

export function IndustryTemplatesPage() {
  const navigate = useNavigate()
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(null)
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyTemplate = async (template: IndustryTemplate) => {
    setIsApplying(true)
    
    try {
      // Simulate API call to apply template
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save template configuration
      localStorage.setItem('industryProfile', template.industryType)
      localStorage.setItem('appliedTemplate', JSON.stringify({
        templateId: template.id,
        appliedAt: new Date().toISOString(),
        features: template.features,
        scenarios: template.scenarios,
      }))
      
      // Show success and redirect
      alert(`Template "${template.name}" applied successfully! Your system is now configured.`)
      navigate('/')
      window.location.reload()
    } catch (error) {
      alert('Failed to apply template. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'green'
      case 'intermediate': return 'amber'
      case 'advanced': return 'red'
      default: return 'zinc'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Heading>Industry Templates</Heading>
        <Text className="mt-2">
          Quick-start templates with pre-configured settings for your industry
        </Text>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {industryTemplates.map((template) => (
          <div
            key={template.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
              selectedTemplate?.id === template.id
                ? 'border-blue-600 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Heading level={3} className="mb-2">{template.name}</Heading>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </Text>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge color={getComplexityColor(template.complexity)}>
                  {template.complexity}
                </Badge>
                <Badge color="blue">
                  {template.estimatedSetupTime} min setup
                </Badge>
              </div>

              {/* Features */}
              <div className="mb-4">
                <Text className="text-sm font-semibold mb-2">Includes:</Text>
                <ul className="space-y-1">
                  {template.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {template.features.length > 4 && (
                    <li className="text-sm text-gray-500">
                      +{template.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Scenarios */}
              <div className="mb-4">
                <Text className="text-sm font-semibold mb-2">
                  {template.scenarios.length} Pre-configured Scenarios
                </Text>
              </div>

              {/* Apply Button */}
              <Button
                color="blue"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  handleApplyTemplate(template)
                }}
                disabled={isApplying}
              >
                {isApplying ? 'Applying...' : 'Apply Template'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Template Details */}
      {selectedTemplate && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Heading level={2}>{selectedTemplate.name}</Heading>
              <Text className="text-gray-600 dark:text-gray-400 mt-2">
                {selectedTemplate.description}
              </Text>
            </div>
            <Button color="zinc" onClick={() => setSelectedTemplate(null)}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <Heading level={3} className="mb-4">Features</Heading>
              <div className="space-y-2">
                {selectedTemplate.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <Text className="text-sm">{feature}</Text>
                  </div>
                ))}
              </div>
            </div>

            {/* Scenarios */}
            <div>
              <Heading level={3} className="mb-4">Pre-configured Scenarios</Heading>
              <div className="space-y-3">
                {selectedTemplate.scenarios.map((scenario) => (
                  <div key={scenario.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Text className="font-medium">{scenario.name}</Text>
                      <Badge color={scenario.sensitivity === 'high' ? 'red' : scenario.sensitivity === 'medium' ? 'amber' : 'zinc'}>
                        {scenario.sensitivity}
                      </Badge>
                    </div>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {scenario.description}
                    </Text>
                    <div className="flex flex-wrap gap-1">
                      {scenario.actions.map((action, idx) => (
                        <Badge key={idx} color="zinc" className="text-xs">
                          {action.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Add-ons */}
            <div>
              <Heading level={3} className="mb-4">Recommended Integrations</Heading>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.recommendedAddons.map((addon, idx) => (
                  <Badge key={idx} color="blue">
                    {addon.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Setup Info */}
            <div>
              <Heading level={3} className="mb-4">Setup Information</Heading>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Text className="text-sm font-semibold mb-1">Estimated Setup Time</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTemplate.estimatedSetupTime} minutes
                  </Text>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Text className="text-sm font-semibold mb-1">Complexity Level</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {selectedTemplate.complexity}
                  </Text>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Text className="text-sm font-semibold mb-1">What You Get</Text>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>✓ {selectedTemplate.features.length} pre-configured features</li>
                    <li>✓ {selectedTemplate.scenarios.length} detection scenarios</li>
                    <li>✓ {selectedTemplate.recommendedAddons.length} integration options</li>
                    <li>✓ Industry-specific dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <Button color="zinc" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={() => handleApplyTemplate(selectedTemplate)}
              disabled={isApplying}
            >
              {isApplying ? 'Applying Template...' : 'Apply This Template'}
            </Button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
        <div className="flex items-start gap-4">
          <div className="text-4xl">💡</div>
          <div>
            <Heading level={3} className="mb-2">Need Help Choosing?</Heading>
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
              Not sure which template is right for you? Consider these factors:
            </Text>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Beginner:</strong> Simple setup, basic features, quick to deploy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Intermediate:</strong> Moderate complexity, advanced features, some customization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Advanced:</strong> Complex setup, enterprise features, full customization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

