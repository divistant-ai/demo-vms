import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Text } from '../components/catalyst/text'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { Field, FieldGroup, Label } from '../components/catalyst/fieldset'
import { Textarea } from '../components/catalyst/textarea'
import { incidentApi } from '../services/api/incidentApi'
import { format } from 'date-fns'
import { LoadingState, EmptyState } from '../utils/loadingStates'

function VideoPlayer({ videoUrl }: { videoUrl: string; incidentId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const time = parseFloat(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg border border-zinc-200 bg-zinc-900 overflow-hidden dark:border-zinc-800">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-64 sm:h-80 lg:h-96"
          controls
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
          <div className="flex items-center gap-4">
            <Button plain onClick={togglePlay} className="text-white">
              {isPlaying ? '⏸️' : '▶️'}
            </Button>
            
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <Text className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
            
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value)
                setPlaybackRate(rate)
                if (videoRef.current) {
                  videoRef.current.playbackRate = rate
                }
              }}
              className="bg-zinc-700 text-white text-sm rounded px-2 py-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

function IncidentTimeline({ incidentId }: { incidentId: string }) {
  const { data: incident } = useQuery({
    queryKey: ['incidents', incidentId],
    queryFn: () => incidentApi.getById(incidentId),
  })

  if (!incident) return null

  const timelineEvents = [
    {
      time: incident.timestamp,
      action: 'Incident Created',
      by: 'AI System',
      description: 'Automated detection triggered',
    },
    ...(incident.actionHistory || []).map(action => ({
      time: action.timestamp,
      action: action.action,
      by: action.by,
      description: action.description || `${action.action} by ${action.by}`,
    })),
  ].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

  return (
    <div className="space-y-4">
      <Heading level={3}>Timeline</Heading>
      <div className="space-y-3">
        {timelineEvents.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full mt-2" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Text className="font-medium">{event.action}</Text>
                <Badge color="zinc">{event.by}</Badge>
              </div>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                {format(new Date(event.time), 'MMM dd, yyyy HH:mm:ss')}
              </Text>
              <Text className="text-sm mt-1">{event.description}</Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EvidencePanel({ incidentId }: { incidentId: string }) {
  const { data: incident } = useQuery({
    queryKey: ['incidents', incidentId],
    queryFn: () => incidentApi.getById(incidentId),
  })

  if (!incident) return null

  return (
    <div className="space-y-4">
      <Heading level={3}>Evidence</Heading>
      
      {/* Snapshot */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Text className="font-medium mb-2">Incident Snapshot</Text>
        <div className="w-full h-48 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
          <Text className="text-zinc-500">Snapshot Image</Text>
        </div>
      </div>

      {/* Metrics */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Text className="font-medium mb-2">Detection Metrics</Text>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(incident.metrics || {}).map(([key, value]) => (
            <div key={key}>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <Text className="font-medium">{value}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommentSection({ incidentId }: { incidentId: string }) {
  const [newComment, setNewComment] = useState('')
  const [showAddComment, setShowAddComment] = useState(false)

  const { data: incident } = useQuery({
    queryKey: ['incidents', incidentId],
    queryFn: () => incidentApi.getById(incidentId),
  })

  const handleAddComment = () => {
    if (!newComment.trim()) return
    
    // Mock add comment
    console.log('Adding comment:', newComment)
    setNewComment('')
    setShowAddComment(false)
  }

  if (!incident) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Heading level={3}>Comments</Heading>
        <Button onClick={() => setShowAddComment(true)}>Add Comment</Button>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {(incident.comments || []).map((comment, index) => (
          <div key={index} className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 mb-2">
              <Text className="font-medium">{comment.author}</Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                {format(new Date(comment.timestamp), 'MMM dd, yyyy HH:mm')}
              </Text>
            </div>
            <Text>{comment.text}</Text>
          </div>
        ))}
      </div>

      {/* Add Comment Dialog */}
      <Dialog open={showAddComment} onClose={() => setShowAddComment(false)}>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>Comment</Label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Enter your comment..."
                rows={4}
              />
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowAddComment(false)}>Cancel</Button>
          <Button onClick={handleAddComment}>Add Comment</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export function IncidentDetailPage() {
  const { incidentId } = useParams<{ incidentId: string }>()
  const navigate = useNavigate()
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  const { data: incident, isLoading } = useQuery({
    queryKey: ['incidents', incidentId],
    queryFn: () => incidentApi.getById(incidentId!),
    enabled: !!incidentId,
  })

  const handleStatusChange = () => {
    if (!newStatus) return
    
    // Mock status update
    console.log('Updating status to:', newStatus)
    setShowStatusDialog(false)
    setNewStatus('')
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red'
      case 'high': return 'orange'
      case 'medium': return 'yellow'
      case 'low': return 'green'
      default: return 'zinc'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'green'
      case 'in_progress': return 'blue'
      case 'acknowledged': return 'yellow'
      default: return 'zinc'
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading incident details..." />
  }

  if (!incident) {
    return (
      <EmptyState 
        title="Incident not found" 
        message="The requested incident could not be found."
        action={<Button onClick={() => navigate('/incidents')}>Back to Incidents</Button>}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button plain onClick={() => navigate('/incidents')}>
              ← Back to Incidents
            </Button>
            <Heading>Incident #{incident.id}</Heading>
          </div>
          <Text className="text-zinc-500 dark:text-zinc-400">
            {format(new Date(incident.timestamp), 'MMM dd, yyyy HH:mm:ss')}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={getSeverityColor(incident.severity)}>
            {incident.severity}
          </Badge>
          <Badge color={getStatusColor(incident.status)}>
            {incident.status}
          </Badge>
          <Button onClick={() => setShowStatusDialog(true)}>
            Update Status
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Video & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer 
            videoUrl={incident.evidence.videoClip || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
            incidentId={incident.id}
          />

          {/* Incident Details */}
          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <Heading level={3} className="mb-4">Incident Details</Heading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Type</Text>
                <Text className="font-medium">{incident.type.replace('_', ' ')}</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Location</Text>
                <Text className="font-medium">{incident.location}</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Camera ID</Text>
                <Text className="font-medium">{incident.cameraId}</Text>
              </div>
              <div>
                <Text className="text-sm text-zinc-500 dark:text-zinc-400">Assigned To</Text>
                <Text className="font-medium">{incident.assignedTo || 'Unassigned'}</Text>
              </div>
            </div>
            <div className="mt-4">
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">Description</Text>
              <Text className="mt-1">{incident.description}</Text>
            </div>
          </div>

          {/* Timeline */}
          <IncidentTimeline incidentId={incident.id} />

          {/* Comments */}
          <CommentSection incidentId={incident.id} />
        </div>

        {/* Right Column - Evidence & Actions */}
        <div className="space-y-6">
          <EvidencePanel incidentId={incident.id} />
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onClose={() => setShowStatusDialog(false)}>
        <DialogTitle>Update Incident Status</DialogTitle>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>New Status</Label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <option value="">Select status...</option>
                <option value="open">Open</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </Field>
          </FieldGroup>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleStatusChange}>Update Status</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

