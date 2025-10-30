import { useState } from 'react'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Input } from '../components/catalyst/input'
import { Select } from '../components/catalyst/select'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'

interface InsightRecommendation {
  id: string
  category: 'performance' | 'security' | 'optimization' | 'maintenance'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  impact: string
  effort: string
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: Date
}

const mockRecommendations: InsightRecommendation[] = [
  {
    id: 'rec-001',
    category: 'performance',
    title: 'Optimize Camera Resolution for Better Performance',
    description: 'Consider reducing resolution for cameras in low-traffic areas to improve overall system performance and reduce bandwidth usage.',
    priority: 'high',
    impact: 'Reduce bandwidth usage by 30%',
    effort: '2-3 hours',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'rec-002',
    category: 'security',
    title: 'Enable Multi-Factor Authentication',
    description: 'Implement MFA for all administrative accounts to enhance security posture and prevent unauthorized access.',
    priority: 'high',
    impact: 'Significantly improve security',
    effort: '4-6 hours',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'rec-003',
    category: 'optimization',
    title: 'Implement Smart Storage Management',
    description: 'Set up automated retention policies to optimize storage usage and reduce costs while maintaining compliance requirements.',
    priority: 'medium',
    impact: 'Reduce storage costs by 40%',
    effort: '1-2 days',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'rec-004',
    category: 'maintenance',
    title: 'Schedule Regular System Updates',
    description: 'Establish a regular maintenance schedule for system updates and security patches to ensure optimal performance.',
    priority: 'medium',
    impact: 'Improve system stability',
    effort: '1 hour weekly',
    status: 'completed',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
]

export function AIInsightPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [showChatDialog, setShowChatDialog] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([
    {
      id: '1',
      type: 'assistant',
      message: 'Hello! I\'m your AI Insight Assistant. I can help you optimize your VMS system, provide best practices, and answer questions about your surveillance setup. How can I assist you today?',
      timestamp: new Date()
    }
  ])

  const filteredRecommendations = mockRecommendations.filter(rec => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false
    if (selectedPriority !== 'all' && rec.priority !== selectedPriority) return false
    return true
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'blue'
      case 'security': return 'red'
      case 'optimization': return 'green'
      case 'maintenance': return 'yellow'
      default: return 'zinc'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'zinc'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green'
      case 'in_progress': return 'blue'
      case 'pending': return 'yellow'
      default: return 'zinc'
    }
  }

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: chatMessage,
      timestamp: new Date()
    }

    // Mock AI response
    const aiResponse = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      message: generateAIResponse(chatMessage),
      timestamp: new Date()
    }

    setChatHistory(prev => [...prev, userMessage, aiResponse])
    setChatMessage('')
  }

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('optimize')) {
      return 'Based on your system analysis, I recommend: 1) Implementing adaptive bitrate streaming for better bandwidth management, 2) Using hardware acceleration for video processing, 3) Setting up intelligent storage tiering. Would you like me to elaborate on any of these recommendations?'
    } else if (lowerMessage.includes('security') || lowerMessage.includes('secure')) {
      return 'For enhanced security, consider: 1) Enabling end-to-end encryption for all video streams, 2) Implementing role-based access control, 3) Setting up intrusion detection systems, 4) Regular security audits and penetration testing. I can help you implement any of these measures.'
    } else if (lowerMessage.includes('storage') || lowerMessage.includes('capacity')) {
      return 'Storage optimization strategies: 1) Implement intelligent compression algorithms, 2) Use cloud storage for long-term archival, 3) Set up automated retention policies, 4) Consider edge storage for critical cameras. Current analysis shows you could save 40% on storage costs.'
    } else if (lowerMessage.includes('camera') || lowerMessage.includes('placement')) {
      return 'Camera placement best practices: 1) Position cameras at 8-12 feet height for optimal coverage, 2) Avoid direct sunlight and backlighting, 3) Ensure 20-30% overlap between cameras, 4) Use PTZ cameras for large areas, 5) Consider weather protection for outdoor installations.'
    } else if (lowerMessage.includes('analytics') || lowerMessage.includes('ai')) {
      return 'AI analytics optimization: 1) Train models with diverse datasets for better accuracy, 2) Use edge processing for real-time analysis, 3) Implement confidence thresholds to reduce false positives, 4) Regular model retraining with new data, 5) Consider specialized models for different scenarios.'
    } else {
      return 'I understand you\'re asking about "' + message + '". Based on your VMS system configuration, I can provide specific recommendations. Could you be more specific about what aspect you\'d like me to help with? I can assist with performance optimization, security enhancements, storage management, camera placement, or AI analytics configuration.'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>AI Insight Assistant</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Get intelligent recommendations and best practices for your VMS system
          </p>
        </div>
        <Button onClick={() => setShowChatDialog(true)}>
          Chat with AI Assistant
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Active Recommendations</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Completed</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">3</div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">In Progress</div>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">1</div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">High Priority</div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <Label>Category</Label>
              <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">All Categories</option>
                <option value="performance">Performance</option>
                <option value="security">Security</option>
                <option value="optimization">Optimization</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </Field>
            <Field>
              <Label>Priority</Label>
              <Select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)}>
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </Select>
            </Field>
          </div>
        </FieldGroup>
      </div>

      {/* Recommendations */}
      <div className="space-y-4">
        {filteredRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color={getCategoryColor(recommendation.category)}>
                    {recommendation.category}
                  </Badge>
                  <Badge color={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority} priority
                  </Badge>
                  <Badge color={getStatusColor(recommendation.status)}>
                    {recommendation.status}
                  </Badge>
                </div>
                <Heading level={3} className="mb-2">{recommendation.title}</Heading>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">{recommendation.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Impact: </span>
                    <span className="text-zinc-950 dark:text-white">{recommendation.impact}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 dark:text-zinc-400">Effort: </span>
                    <span className="text-zinc-950 dark:text-white">{recommendation.effort}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button plain>View Details</Button>
                <Button>Implement</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Chat Dialog */}
      <Dialog open={showChatDialog} onClose={() => setShowChatDialog(false)} size="xl">
        <DialogTitle>AI Insight Assistant</DialogTitle>
        <DialogBody>
          <div className="h-96 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4">
            <div className="space-y-4">
              {chatHistory.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white'
                  }`}>
                    <div className="text-sm">{message.message}</div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-zinc-500 dark:text-zinc-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask me anything about your VMS system..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowChatDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
