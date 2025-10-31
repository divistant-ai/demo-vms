import { useEffect, useState } from 'react'
import { Heading } from '../catalyst/heading'
import { Text } from '../catalyst/text'
import { Badge } from '../catalyst/badge'
import { getIndustryProfile } from '../../data/industryProfiles'
import type { IndustryType, DashboardWidget } from '../../types/industry'
import { useRealtimeData } from '../../hooks/useRealtimeData'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

// Generate dummy chart data based on widget type
function generateChartData(dataSource: string, chartType: string) {
  const now = new Date()
  const hours = 24
  
  if (chartType === 'pie') {
    // For pie charts - distribution data
    if (dataSource === 'heatmap' || dataSource === 'zones') {
      return [
        { name: 'Zone A', value: 35 },
        { name: 'Zone B', value: 25 },
        { name: 'Zone C', value: 20 },
        { name: 'Zone D', value: 15 },
        { name: 'Zone E', value: 5 },
      ]
    }
    return [
      { name: 'Category 1', value: 400 },
      { name: 'Category 2', value: 300 },
      { name: 'Category 3', value: 200 },
      { name: 'Category 4', value: 100 },
    ]
  }
  
  // For line/bar charts - time series data
  const data = []
  for (let i = hours - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = timestamp.getHours()
    
    // Different patterns based on data source
    let value = 0
    if (dataSource === 'traffic' || dataSource === 'people_count') {
      // Peak hours: 8-10 AM and 5-7 PM
      if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
        value = 80 + Math.random() * 40
      } else if (hour >= 11 && hour <= 16) {
        value = 50 + Math.random() * 30
      } else {
        value = 10 + Math.random() * 20
      }
    } else if (dataSource === 'queue') {
      // Queue times higher during peak hours
      if ((hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 20)) {
        value = 5 + Math.random() * 3
      } else {
        value = 1 + Math.random() * 2
      }
    } else if (dataSource === 'incidents' || dataSource === 'alerts') {
      // Random incidents throughout the day
      value = Math.random() < 0.3 ? Math.floor(Math.random() * 5) : 0
    } else {
      // Default pattern
      value = 30 + Math.random() * 40
    }
    
    data.push({
      time: `${hour.toString().padStart(2, '0')}:00`,
      value: Math.round(value),
    })
  }
  
  return data
}

// Widget Components
function MetricWidget({ widget, data }: { widget: DashboardWidget; data: any }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">{widget.title}</Text>
      <div className="flex items-baseline gap-2">
        <Heading level={2} className="text-3xl">{data?.value || '0'}</Heading>
        <Text className="text-sm text-gray-500">{data?.unit || ''}</Text>
      </div>
      {data?.change && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          data.change > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{data.change > 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(data.change)}%</span>
          <span className="text-gray-500">vs last period</span>
        </div>
      )}
    </div>
  )
}

function ChartWidget({ widget }: { widget: DashboardWidget }) {
  const chartType = (widget.config.chartType as string) || 'line'
  const chartData = generateChartData(widget.dataSource, chartType)
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <Heading level={3} className="mb-4">{widget.title}</Heading>
      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              name={widget.title}
            />
          </LineChart>
        ) : chartType === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
              labelStyle={{ color: '#F3F4F6' }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8B5CF6" name={widget.title} />
          </BarChart>
        ) : chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

function MapWidget({ widget }: { widget: DashboardWidget }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <Heading level={3} className="mb-4">{widget.title}</Heading>
      <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
        <iframe
          title={widget.title}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.23484177!2d106.68942995!3d-6.229386849999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta!5e0!3m2!1sen!2sid!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>
    </div>
  )
}

function TableWidget({ widget, data }: { widget: DashboardWidget; data: any[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <Heading level={3} className="mb-4">{widget.title}</Heading>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold">Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Event</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.slice(0, widget.config.limit as number || 5).map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 text-sm">{item.time}</td>
                <td className="py-3 px-4 text-sm">{item.event}</td>
                <td className="py-3 px-4">
                  <Badge color={item.status === 'active' ? 'green' : 'zinc'}>
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AlertWidget({ widget, data }: { widget: DashboardWidget; data: any[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <Heading level={3} className="mb-4">{widget.title}</Heading>
      <div className="space-y-3">
        {data?.slice(0, widget.config.limit as number || 5).map((alert: any, idx: number) => (
          <div key={idx} className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-red-600 text-xl">⚠️</div>
              <div className="flex-1">
                <Text className="font-medium text-red-900 dark:text-red-200">{alert.title}</Text>
                <Text className="text-sm text-red-700 dark:text-red-300">{alert.message}</Text>
                <Text className="text-xs text-red-600 dark:text-red-400 mt-1">{alert.time}</Text>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CameraGridWidget({ widget }: { widget: DashboardWidget }) {
  const { cameras } = useRealtimeData()
  const filteredCameras = widget.config.filter 
    ? cameras.filter((c: any) => c.location.zone === widget.config.filter)
    : cameras.slice(0, (widget.config.columns as number || 2) * 2)

  const gridCols = widget.config.columns === 1 ? 'grid-cols-1' : 
                   widget.config.columns === 3 ? 'grid-cols-3' : 
                   widget.config.columns === 4 ? 'grid-cols-4' : 'grid-cols-2'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <Heading level={3} className="mb-4">{widget.title}</Heading>
      <div className={`grid ${gridCols} gap-4`}>
        {filteredCameras.map((camera: any) => (
          <div key={camera.id} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📹</div>
                <Text className="text-white text-sm">{camera.name}</Text>
                <Badge color={camera.status === 'online' ? 'green' : 'red'} className="mt-2">
                  {camera.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DynamicDashboard() {
  const [industryType, setIndustryType] = useState<IndustryType | null>(null)
  const [widgets, setWidgets] = useState<DashboardWidget[]>([])
  useRealtimeData() // Keep realtime data flowing

  useEffect(() => {
    const savedIndustry = localStorage.getItem('industryProfile') as IndustryType
    if (savedIndustry) {
      setIndustryType(savedIndustry)
      const profile = getIndustryProfile(savedIndustry)
      if (profile) {
        setWidgets(profile.dashboardLayout.widgets)
      }
    }
  }, [])

  const profile = industryType ? getIndustryProfile(industryType) : null

  // Mock data for widgets
  const mockData = {
    'visitor-count': { value: '1,234', unit: 'visitors', change: 12 },
    'avg-queue': { value: '3.5', unit: 'min', change: -8 },
    'theft-alerts': { value: '2', unit: 'alerts', change: -50 },
    'vehicles-in-yard': { value: '45', unit: 'vehicles', change: 5 },
    'active-shipments': { value: '128', unit: 'shipments', change: 15 },
    'safety-incidents': { value: '0', unit: 'incidents', change: -100 },
    'traffic-flow': { value: '85', unit: '%', change: -3 },
    'active-incidents': { value: '3', unit: 'incidents', change: 0 },
    'air-quality': { value: '42', unit: 'AQI', change: -12 },
    'production-rate': { value: '95', unit: '%', change: 3 },
    'defect-rate': { value: '1.2', unit: '%', change: -15 },
    'safety-score': { value: '98', unit: '%', change: 2 },
    'passenger-count': { value: '15,234', unit: 'passengers', change: 8 },
    'active-vehicles': { value: '42', unit: 'vehicles', change: 0 },
    'security-alerts': { value: '1', unit: 'alerts', change: -50 },
    'alerts-today': { value: '5', unit: 'alerts', change: 20 },
    'uptime': { value: '99.8', unit: '%', change: 0.1 },
  }

  const mockTableData = [
    { time: '10:30 AM', event: 'Motion detected', status: 'active' },
    { time: '10:25 AM', event: 'Door opened', status: 'resolved' },
    { time: '10:20 AM', event: 'Person detected', status: 'active' },
    { time: '10:15 AM', event: 'Vehicle entered', status: 'resolved' },
    { time: '10:10 AM', event: 'Alarm triggered', status: 'active' },
  ]

  const mockAlerts = [
    { title: 'Intrusion Detected', message: 'Motion detected in restricted area', time: '2 minutes ago' },
    { title: 'Camera Offline', message: 'CAM-003 has been offline for 5 minutes', time: '5 minutes ago' },
    { title: 'High Temperature', message: 'Temperature exceeded threshold in Zone A', time: '10 minutes ago' },
  ]

  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return <MetricWidget key={widget.id} widget={widget} data={mockData[widget.id as keyof typeof mockData]} />
      case 'chart':
        return <ChartWidget key={widget.id} widget={widget} />
      case 'map':
        return <MapWidget key={widget.id} widget={widget} />
      case 'table':
        return <TableWidget key={widget.id} widget={widget} data={mockTableData} />
      case 'alert':
        return <AlertWidget key={widget.id} widget={widget} data={mockAlerts} />
      case 'camera_grid':
        return <CameraGridWidget key={widget.id} widget={widget} />
      default:
        return null
    }
  }

  const getGridClass = (size: string) => {
    switch (size) {
      case 'small': return 'col-span-1'
      case 'medium': return 'col-span-1 md:col-span-2'
      case 'large': return 'col-span-1 md:col-span-2 lg:col-span-3'
      case 'full': return 'col-span-1 md:col-span-2 lg:col-span-4'
      default: return 'col-span-1'
    }
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎯</div>
        <Heading level={2} className="mb-4">No Industry Profile Set</Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          Complete onboarding to see your personalized dashboard
        </Text>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{profile.icon}</div>
          <div>
            <Heading>{profile.name} Dashboard</Heading>
            <Text className="text-gray-600 dark:text-gray-400">{profile.description}</Text>
          </div>
        </div>
        <Badge color="blue">{profile.type.replace('_', ' ').toUpperCase()}</Badge>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {profile.kpiMetrics.slice(0, 4).map((kpi) => (
          <div key={kpi.id} className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
            <Text className="text-sm opacity-90 mb-2">{kpi.name}</Text>
            <Heading level={2} className="text-3xl mb-1">
              {mockData[kpi.id as keyof typeof mockData]?.value || '0'}
            </Heading>
            <Text className="text-xs opacity-75">{kpi.description}</Text>
          </div>
        ))}
      </div>

      {/* Dynamic Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className={getGridClass(widget.size)}>
            {renderWidget(widget)}
          </div>
        ))}
      </div>

      {/* Industry-Specific Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <Heading level={3} className="mb-4">Industry Insights</Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {profile.recommendedFeatures.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {idx + 1}
                </div>
                <Text className="font-semibold">{feature}</Text>
              </div>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Optimize your {profile.name.toLowerCase()} operations
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

