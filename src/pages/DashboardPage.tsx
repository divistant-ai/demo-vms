import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Text } from '../components/catalyst/text'
import { analyticsApi } from '../services/api/analyticsApi'
import { alertApi } from '../services/api/alertApi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { LoadingState, EmptyState } from '../utils/loadingStates'
import { useRealtimeData } from '../hooks/useRealtimeData'
import { DynamicDashboard } from '../components/dashboard/DynamicDashboard'

// AI Insights Icons
function BrainIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

function LightBulbIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}

function TrendingUpIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function ExclamationTriangleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}


// AI Recommendations for Smart City + ABL Logistics use cases
const getAIRecommendations = (useCase: string) => {
  switch (useCase) {
    case 'traffic':
      return [
        {
          title: 'Optimize Traffic Light Timing',
          description: 'Adjust signal timing at Main Street intersection to reduce congestion by 15%',
          priority: 'high' as const,
          impact: 'High impact on traffic flow'
        },
        {
          title: 'Add Lane Markings',
          description: 'Install clear lane markings to improve traffic organization',
          priority: 'medium' as const,
          impact: 'Medium impact on safety'
        },
        {
          title: 'Monitor Rush Hour Patterns',
          description: 'Current patterns show 20% increase in morning traffic',
          priority: 'low' as const,
          impact: 'Low impact on operations'
        }
      ]
    case 'flood':
      return [
        {
          title: 'Increase Monitoring Frequency',
          description: 'Water levels rising faster than predicted. Increase monitoring to every 15 minutes',
          priority: 'high' as const,
          impact: 'High impact on safety'
        },
        {
          title: 'Deploy Additional Sensors',
          description: 'Install backup sensors at critical flood points',
          priority: 'medium' as const,
          impact: 'Medium impact on reliability'
        },
        {
          title: 'Update Flood Models',
          description: 'Current models show 95% accuracy. Consider updating for better predictions',
          priority: 'low' as const,
          impact: 'Low impact on accuracy'
        }
      ]
    case 'crowd':
      return [
        {
          title: 'Implement Crowd Control',
          description: 'Density exceeding safe limits. Deploy crowd control measures immediately',
          priority: 'high' as const,
          impact: 'High impact on safety'
        },
        {
          title: 'Optimize Entry Points',
          description: 'Redirect crowd flow to less congested entry points',
          priority: 'medium' as const,
          impact: 'Medium impact on flow'
        },
        {
          title: 'Schedule Staff Deployment',
          description: 'Peak hours identified. Schedule additional staff for crowd management',
          priority: 'low' as const,
          impact: 'Low impact on operations'
        }
      ]
    case 'security':
      return [
        {
          title: 'Investigate Suspicious Activity',
          description: 'Multiple intrusion attempts detected. Review security protocols',
          priority: 'high' as const,
          impact: 'High impact on security'
        },
        {
          title: 'Update Access Control',
          description: 'Strengthen perimeter security with additional cameras',
          priority: 'medium' as const,
          impact: 'Medium impact on security'
        },
        {
          title: 'Review Incident Reports',
          description: 'Pattern analysis shows 30% reduction in security incidents',
          priority: 'low' as const,
          impact: 'Low impact on operations'
        }
      ]
    case 'safety':
      return [
        {
          title: 'Enhance PPE Compliance Monitoring',
          description: 'Deploy additional AI cameras to monitor PPE compliance in high-risk areas. Current compliance at 94.2%',
          priority: 'high' as const,
          impact: 'High impact on HSE compliance and worker safety'
        },
        {
          title: 'Implement Behavioral Analytics',
          description: 'Analyze worker behavior patterns to identify potential safety risks before incidents occur',
          priority: 'medium' as const,
          impact: 'Medium impact on incident prevention'
        },
        {
          title: 'Schedule Safety Training',
          description: 'AI detected 15% increase in unsafe behaviors. Schedule refresher training for affected personnel',
          priority: 'low' as const,
          impact: 'Low impact on training effectiveness'
        }
      ]
    case 'stevedoring':
      return [
        {
          title: 'Optimize Crane Scheduling',
          description: 'AI analysis shows 12% efficiency gain possible by rescheduling crane operations during peak hours',
          priority: 'high' as const,
          impact: 'High impact on port productivity and vessel turnaround'
        },
        {
          title: 'Implement Predictive Loading',
          description: 'Use AI to predict optimal loading sequences based on cargo type and vessel characteristics',
          priority: 'medium' as const,
          impact: 'Medium impact on loading efficiency'
        },
        {
          title: 'Monitor Berth Utilization',
          description: 'Current berth utilization at 87.3%. Consider expanding operations to Berth D',
          priority: 'low' as const,
          impact: 'Low impact on capacity planning'
        }
      ]
    case 'vessel-maintenance':
      return [
        {
          title: 'Schedule Preventive Maintenance',
          description: 'MV ABL-002 showing early signs of engine wear. Schedule maintenance before next voyage',
          priority: 'high' as const,
          impact: 'High impact on vessel reliability and cost savings'
        },
        {
          title: 'Implement Predictive Analytics',
          description: 'Deploy AI sensors to monitor engine performance and predict maintenance needs',
          priority: 'medium' as const,
          impact: 'Medium impact on maintenance efficiency'
        },
        {
          title: 'Optimize Fuel Consumption',
          description: 'Current fuel efficiency at 8.7 L/tonne. AI suggests 5% improvement with route optimization',
          priority: 'low' as const,
          impact: 'Low impact on operational costs'
        }
      ]
    case 'stockpile':
      return [
        {
          title: 'Optimize Conveyor Belt Speed',
          description: 'AI analysis shows 8% throughput increase possible by adjusting conveyor speed based on cargo type',
          priority: 'high' as const,
          impact: 'High impact on loading efficiency and throughput'
        },
        {
          title: 'Implement Stockpile Monitoring',
          description: 'Deploy AI cameras to monitor stockpile levels and prevent overloading',
          priority: 'medium' as const,
          impact: 'Medium impact on inventory management'
        },
        {
          title: 'Schedule Maintenance Windows',
          description: 'Conveyor efficiency at 94.8%. Schedule maintenance during low-activity periods',
          priority: 'low' as const,
          impact: 'Low impact on operational continuity'
        }
      ]
    case 'fleet-tracking':
      return [
        {
          title: 'Implement Real-time Tracking',
          description: 'Deploy AI-powered visual tracking system for fleet vessels to improve ETA accuracy',
          priority: 'high' as const,
          impact: 'High impact on fleet visibility and customer satisfaction'
        },
        {
          title: 'Optimize Route Planning',
          description: 'AI analysis shows 3% fuel savings possible with optimized routes for current cargo',
          priority: 'medium' as const,
          impact: 'Medium impact on fuel efficiency and costs'
        },
        {
          title: 'Enhance Cargo Traceability',
          description: 'Implement AI-based cargo tracking to improve supply chain visibility',
          priority: 'low' as const,
          impact: 'Low impact on customer service'
        }
      ]
    default:
      return []
  }
}

export function DashboardPage() {
  const [selectedUseCase, setSelectedUseCase] = useState<'traffic' | 'flood' | 'crowd' | 'security' | 'safety' | 'stevedoring' | 'vessel-maintenance' | 'stockpile' | 'fleet-tracking'>('traffic')
  const [useDynamicDashboard, setUseDynamicDashboard] = useState(false)
  
  // Check if user has industry profile
  useEffect(() => {
    const industryProfile = localStorage.getItem('industryProfile')
    if (industryProfile) {
      setUseDynamicDashboard(true)
    }
  }, [])
  
  // Realtime data streaming - data mengalir tanpa reload
  const realtimeData = useRealtimeData()
  
  // Toggle between dynamic and default dashboard
  if (useDynamicDashboard) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button color="zinc" onClick={() => setUseDynamicDashboard(false)}>
            Switch to Default Dashboard
          </Button>
        </div>
        <DynamicDashboard />
      </div>
    )
  }

  // const { data: overview } = useQuery({
  //   queryKey: ['analytics', 'overview'],
  //   queryFn: () => analyticsApi.getOverview(),
  // })

  const { data: timeSeries, isLoading: timeSeriesLoading } = useQuery({
    queryKey: ['analytics', 'timeseries'],
    queryFn: () => analyticsApi.getTimeSeries(1),
    initialData: realtimeData.analytics.timeSeries,
  })

  const { data: distribution, isLoading: distributionLoading } = useQuery({
    queryKey: ['analytics', 'distribution'],
    queryFn: () => analyticsApi.getDistribution(),
  })

  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertApi.getAll(),
  })
  
  // Use realtime data for display
  const displayTimeSeries = realtimeData.analytics.timeSeries || timeSeries

  // const { data: cameras } = useQuery({
  //   queryKey: ['cameras'],
  //   queryFn: () => cameraApi.getAll(),
  // })

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  // Generate use case specific data (Smart City + ABL Logistics)
  const getUseCaseData = () => {
    switch (selectedUseCase) {
      case 'traffic':
        return {
          title: 'Traffic Monitoring Dashboard',
          description: 'Real-time traffic flow analysis and congestion monitoring',
          metrics: [
            { label: 'Vehicle Count', value: '1,247', unit: 'vehicles', trend: '+12%' },
            { label: 'Avg Speed', value: '32.5', unit: 'km/h', trend: '-3%' },
            { label: 'Congestion Level', value: 'Medium', unit: '', trend: '+5%' },
            { label: 'Flow Rate', value: '2,156', unit: 'veh/h', trend: '+8%' }
          ]
        }
      case 'flood':
        return {
          title: 'Flood Detection Dashboard',
          description: 'Water level monitoring and flood risk assessment',
          metrics: [
            { label: 'Water Level', value: '0.45', unit: 'meters', trend: '+2%' },
            { label: 'Flooded Area', value: '125', unit: 'm²', trend: '+15%' },
            { label: 'Risk Level', value: 'Low', unit: '', trend: 'stable' },
            { label: 'Flow Rate', value: '1.2', unit: 'm/s', trend: '+5%' }
          ]
        }
      case 'crowd':
        return {
          title: 'Crowd Detection Dashboard',
          description: 'People density monitoring and crowd management',
          metrics: [
            { label: 'People Count', value: '342', unit: 'people', trend: '+18%' },
            { label: 'Density', value: '2.1', unit: 'people/m²', trend: '+12%' },
            { label: 'Movement Speed', value: '1.8', unit: 'm/s', trend: '-5%' },
            { label: 'Crowd Level', value: 'High', unit: '', trend: '+8%' }
          ]
        }
      case 'security':
        return {
          title: 'Security Monitoring Dashboard',
          description: 'Intrusion detection and security incident monitoring',
          metrics: [
            { label: 'Active Alerts', value: '3', unit: 'alerts', trend: '-25%' },
            { label: 'Detections (24h)', value: '47', unit: 'events', trend: '+15%' },
            { label: 'Response Time', value: '2.3', unit: 'min', trend: '-10%' },
            { label: 'Threat Level', value: 'Medium', unit: '', trend: 'stable' }
          ]
        }
      case 'safety':
        return {
          title: 'Safety Monitoring & HSE Analytics',
          description: 'Real-time safety monitoring and human behavior analytics for maritime operations',
          metrics: [
            { label: 'Active Personnel', value: '156', unit: 'people', trend: '+8%' },
            { label: 'Safety Incidents', value: '2', unit: 'incidents', trend: '-40%' },
            { label: 'PPE Compliance', value: '94.2', unit: '%', trend: '+2%' },
            { label: 'Risk Score', value: 'Low', unit: '', trend: 'stable' }
          ]
        }
      case 'stevedoring':
        return {
          title: 'Stevedoring & Cargo Operations',
          description: 'Monitoring bongkar-muat operations and port productivity',
          metrics: [
            { label: 'Cargo Throughput', value: '2,847', unit: 'tonnes', trend: '+15%' },
            { label: 'Vessel Dwell Time', value: '18.5', unit: 'hours', trend: '-12%' },
            { label: 'Crane Utilization', value: '87.3', unit: '%', trend: '+5%' },
            { label: 'Loading Rate', value: '154', unit: 'tonnes/hr', trend: '+8%' }
          ]
        }
      case 'vessel-maintenance':
        return {
          title: 'Vessel Condition Monitoring',
          description: 'Preventive maintenance monitoring for fleet vessels and barges',
          metrics: [
            { label: 'Fleet Health', value: '92.1', unit: '%', trend: '+3%' },
            { label: 'Maintenance Alerts', value: '5', unit: 'alerts', trend: '-20%' },
            { label: 'Fuel Efficiency', value: '8.7', unit: 'L/tonne', trend: '+5%' },
            { label: 'Downtime Hours', value: '12', unit: 'hours', trend: '-25%' }
          ]
        }
      case 'stockpile':
        return {
          title: 'Stockpile & Conveyor Monitoring',
          description: 'Monitoring stockpile levels and conveyor belt operations',
          metrics: [
            { label: 'Stockpile Level', value: '78,450', unit: 'tonnes', trend: '+12%' },
            { label: 'Conveyor Efficiency', value: '94.8', unit: '%', trend: '+2%' },
            { label: 'Loading Rate', value: '1,250', unit: 'tonnes/hr', trend: '+8%' },
            { label: 'Belt Speed', value: '2.8', unit: 'm/s', trend: 'stable' }
          ]
        }
      case 'fleet-tracking':
        return {
          title: 'Fleet Tracking & Traceability',
          description: 'Visual tracking and traceability of barges and fleet vessels',
          metrics: [
            { label: 'Active Vessels', value: '23', unit: 'vessels', trend: '+2' },
            { label: 'Cargo in Transit', value: '45,230', unit: 'tonnes', trend: '+18%' },
            { label: 'Average Speed', value: '12.4', unit: 'knots', trend: '+3%' },
            { label: 'ETA Accuracy', value: '96.7', unit: '%', trend: '+1%' }
          ]
        }
    }
  }

  const useCaseData = getUseCaseData()

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <Heading className="text-2xl font-bold text-gray-900 dark:text-white">
                  {useCaseData?.title}
                </Heading>
                <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                  {useCaseData?.description}
                </p>
              </div>
              <div className="w-full sm:w-80">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Select Use Case
                </label>
                <select 
                  value={selectedUseCase} 
                  onChange={(e) => setSelectedUseCase(e.target.value as any)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
            <optgroup label="Smart City Use Cases">
              <option value="traffic">Traffic Monitoring</option>
              <option value="flood">Flood Detection</option>
              <option value="crowd">Crowd Detection</option>
              <option value="security">Security Monitoring</option>
            </optgroup>
            <optgroup label="ABL Logistics Use Cases">
              <option value="safety">Safety Monitoring & HSE</option>
              <option value="stevedoring">Stevedoring Operations</option>
              <option value="vessel-maintenance">Vessel Maintenance</option>
              <option value="stockpile">Stockpile & Conveyor</option>
              <option value="fleet-tracking">Fleet Tracking</option>
            </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {useCaseData?.metrics.map((metric, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {metric.label}
                </div>
                <div className="mt-4 flex items-baseline">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {metric.value}
                    {metric.unit && (
                      <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">
                        {metric.unit}
                      </span>
                    )}
                  </div>
                  <div className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    metric.trend.startsWith('+') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    metric.trend.startsWith('-') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {metric.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Insights Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                  <BrainIcon />
                </div>
                <div>
                  <Heading level={2} className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Insights & Recommendations
                  </Heading>
                  <Text className="text-base text-gray-600 dark:text-gray-300 mt-1">
                    Smart analysis and actionable recommendations for your {selectedUseCase} monitoring
                  </Text>
                </div>
              </div>
              <Button color="blue" className="w-full sm:w-auto px-6 py-3">
                View All Insights
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <div className="space-y-4">
                <Heading level={3} className="flex items-center gap-2">
                  <LightBulbIcon />
                  Smart Recommendations
                </Heading>
                <div className="space-y-3">
                  {getAIRecommendations(selectedUseCase).map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <div className={`p-1 rounded-full ${
                        recommendation.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20' :
                        recommendation.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                        'bg-green-100 dark:bg-green-900/20'
                      }`}>
                        {recommendation.priority === 'high' ? <ExclamationTriangleIcon /> :
                         recommendation.priority === 'medium' ? <TrendingUpIcon /> :
                         <CheckCircleIcon />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-zinc-950 dark:text-white mb-1">
                          {recommendation.title}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                          {recommendation.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge color={
                            recommendation.priority === 'high' ? 'red' :
                            recommendation.priority === 'medium' ? 'yellow' :
                            'green'
                          }>
                            {recommendation.priority} priority
                          </Badge>
                          <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                            {recommendation.impact}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Analytics */}
              <div className="space-y-4">
                <Heading level={3} className="flex items-center gap-2">
                  <TrendingUpIcon />
                  AI Analytics
                </Heading>
                <div className="space-y-4">
                  {/* Performance Metrics */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <Text className="font-medium text-blue-900 dark:text-blue-100">Model Performance</Text>
                      <Badge color="blue">Excellent</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700 dark:text-blue-300">Accuracy</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">94.2%</span>
                      </div>
                      <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '94.2%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Trend Analysis */}
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Text className="font-medium text-zinc-950 dark:text-white mb-2">Trend Analysis</Text>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Peak Activity</span>
                        <span className="text-zinc-950 dark:text-white">2:00 PM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Predicted Risk</span>
                        <span className="text-green-600 dark:text-green-400">Low</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600 dark:text-zinc-400">Anomaly Score</span>
                        <span className="text-zinc-950 dark:text-white">0.12</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Text className="font-medium text-zinc-950 dark:text-white mb-3">Quick Actions</Text>
                    <div className="space-y-2">
                      <Button className="w-full justify-start">
                        <CheckCircleIcon />
                        <span className="ml-2">Apply Recommendations</span>
                      </Button>
                      <Button plain className="w-full justify-start">
                        <TrendingUpIcon />
                        <span className="ml-2">View Detailed Analysis</span>
                      </Button>
                      <Button plain className="w-full justify-start">
                        <BrainIcon />
                        <span className="ml-2">Generate Report</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <Heading level={2} className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Alerts
            </Heading>
            <div className="space-y-3">
              {alertsLoading ? (
                <LoadingState message="Loading alerts..." />
              ) : alerts && alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge color={alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow'}>
                        {alert.severity}
                      </Badge>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{alert.message}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {new Date(alert.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {alert.acknowledged && (
                      <Badge color="green">Acknowledged</Badge>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState 
                  title="No recent alerts" 
                  message="All systems are operating normally. No alerts to display."
                />
              )}
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Time Series Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <Heading level={2} className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Incidents Over Time (24h)
              </Heading>
              {timeSeriesLoading ? (
                <div className="mt-4 h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
              ) : displayTimeSeries ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={displayTimeSeries.map(item => ({
                    time: new Date(item.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                    traffic: item.traffic_incidents,
                    flood: item.flood_alerts,
                    intrusions: item.intrusions,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="traffic" stroke="#0066cc" strokeWidth={2} name="Traffic" />
                    <Line type="monotone" dataKey="flood" stroke="#ff3333" strokeWidth={2} name="Flood" />
                    <Line type="monotone" dataKey="intrusions" stroke="#ffcc00" strokeWidth={2} name="Intrusions" />
                  </LineChart>
                </ResponsiveContainer>
              ) : null}
            </div>

            {/* Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <Heading level={2} className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Incident Distribution
              </Heading>
              {distributionLoading ? (
                <div className="mt-4 h-64 flex items-center justify-center text-gray-500">Loading chart...</div>
              ) : distribution ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Traffic', value: distribution.traffic_congestion },
                        { name: 'Flood', value: distribution.flood_detection },
                        { name: 'Intrusion', value: distribution.intrusion },
                        { name: 'Crowd', value: distribution.crowd_detection },
                        { name: 'Other', value: distribution.other },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3, 4].map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

