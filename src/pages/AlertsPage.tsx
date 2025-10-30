import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Heading } from '../components/catalyst/heading'
import { Badge } from '../components/catalyst/badge'
import { Button } from '../components/catalyst/button'
import { Dialog, DialogTitle, DialogBody, DialogActions } from '../components/catalyst/dialog'
import { alertApi } from '../services/api/alertApi'
import { createMockWebSocket } from '../services/websocket/mockWebSocket'
import type { Alert } from '../types/alert'
import { format } from 'date-fns'
import { LoadingState, EmptyState } from '../utils/loadingStates'
import { exportAlertsToCSV } from '../utils/exportUtils'

function AlertNotification({ alert, onAcknowledge, onDismiss }: { 
  alert: Alert
  onAcknowledge: () => void
  onDismiss: () => void
}) {
  const [open, setOpen] = useState(true)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red'
      case 'high': return 'orange'
      case 'medium': return 'yellow'
      default: return 'green'
    }
  }

  return (
    <Dialog open={open} onClose={() => { setOpen(false); onDismiss() }} size="md">
      <DialogTitle>
        <div className="flex items-center gap-2">
          <Badge color={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
          {alert.type.replace('_', ' ').toUpperCase()}
        </div>
      </DialogTitle>
      <DialogBody>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{alert.message}</p>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          Camera: {alert.cameraId} • {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm:ss')}
        </p>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => { setOpen(false); onDismiss() }}>
          Dismiss
        </Button>
        <Button onClick={() => { setOpen(false); onAcknowledge() }}>
          Acknowledge
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function AlertsPage() {
  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertApi.getAll(),
  })

  const [newAlerts, setNewAlerts] = useState<Array<Alert>>([])

  useEffect(() => {
    const ws = createMockWebSocket()
    
    ws.addEventListener('message', (data: unknown) => {
      const event = data as { data: string }
      const alert: Alert = JSON.parse(event.data)
      setNewAlerts((prev) => [...prev, alert])
      // Refetch alerts list
      setTimeout(() => refetch(), 500)
    })

    return () => {
      ws.close()
    }
  }, [refetch])

  const handleAcknowledge = async (alertId: string) => {
    await alertApi.acknowledge(alertId, 'current-user')
    setNewAlerts((prev) => prev.filter((a) => a.id !== alertId))
    refetch()
  }

  const handleDismiss = (alertId: string) => {
    setNewAlerts((prev) => prev.filter((a) => a.id !== alertId))
  }

  return (
    <div className="space-y-6">
      {/* Real-time notifications */}
      {newAlerts.map((alert) => (
        <AlertNotification
          key={alert.id}
          alert={alert}
          onAcknowledge={() => handleAcknowledge(alert.id)}
          onDismiss={() => handleDismiss(alert.id)}
        />
      ))}

      <div className="flex items-center justify-between">
        <div>
          <Heading>Alert History</Heading>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            View and manage all system alerts
          </p>
        </div>
        <Button onClick={() => alerts && exportAlertsToCSV(alerts)}>Export CSV</Button>
      </div>

      {isLoading ? (
        <LoadingState message="Loading alerts..." />
      ) : alerts && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge color={alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow'}>
                      {alert.severity}
                    </Badge>
                    <span className="font-medium text-zinc-950 dark:text-white">
                      {alert.type.replace('_', ' ').toUpperCase()}
                    </span>
                    {alert.acknowledged && (
                      <Badge color="green">Acknowledged</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{alert.message}</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                    Camera: {alert.cameraId} • {format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <Button
                    plain
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState 
          title="No alerts found" 
          message="All systems are operating normally. No alerts to display."
        />
      )}
    </div>
  )
}

