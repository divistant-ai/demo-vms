import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Badge } from './catalyst/badge'
import { Button } from './catalyst/button'
import { Input } from './catalyst/input'
import { cameraApi } from '../services/api/cameraApi'
import { incidentApi } from '../services/api/incidentApi'
import { alertApi } from '../services/api/alertApi'
import { format } from 'date-fns'

interface SearchResult {
  id: string
  type: 'camera' | 'incident' | 'alert'
  title: string
  subtitle: string
  badge?: {
    text: string
    color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'zinc'
  }
  href: string
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: cameras } = useQuery({
    queryKey: ['cameras'],
    queryFn: () => cameraApi.getAll(),
  })

  const { data: incidents } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => incidentApi.getAll(),
  })

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertApi.getAll(),
  })

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    const searchResults: SearchResult[] = []

    // Search cameras
    cameras?.forEach((camera: any) => {
      if (camera.name.toLowerCase().includes(query.toLowerCase()) ||
          camera.location.address.toLowerCase().includes(query.toLowerCase()) ||
          camera.location.zone.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: camera.id,
          type: 'camera',
          title: camera.name,
          subtitle: camera.location.address,
          badge: {
            text: camera.status,
            color: camera.status === 'online' ? 'green' : 'red'
          },
          href: `/cameras`
        })
      }
    })

    // Search incidents
    incidents?.forEach(incident => {
      if (incident.description.toLowerCase().includes(query.toLowerCase()) ||
          incident.location.toLowerCase().includes(query.toLowerCase()) ||
          incident.type.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: incident.id,
          type: 'incident',
          title: incident.description,
          subtitle: `${incident.location} • ${format(new Date(incident.timestamp), 'MMM dd, yyyy')}`,
          badge: {
            text: incident.severity,
            color: incident.severity === 'critical' ? 'red' : incident.severity === 'high' ? 'orange' : 'yellow'
          },
          href: `/incidents/${incident.id}`
        })
      }
    })

    // Search alerts
    alerts?.forEach(alert => {
      if (alert.message.toLowerCase().includes(query.toLowerCase()) ||
          alert.cameraId.toLowerCase().includes(query.toLowerCase())) {
        searchResults.push({
          id: alert.id,
          type: 'alert',
          title: alert.message,
          subtitle: `Camera ${alert.cameraId} • ${format(new Date(alert.timestamp), 'MMM dd, yyyy')}`,
          badge: {
            text: alert.severity,
            color: alert.severity === 'critical' ? 'red' : alert.severity === 'high' ? 'orange' : 'yellow'
          },
          href: `/alerts`
        })
      }
    })

    setResults(searchResults.slice(0, 10)) // Limit to 10 results
    setIsLoading(false)
  }, [query, cameras, incidents, alerts])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (href: string) => {
    navigate(href)
    setIsOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
        <svg className="h-4 w-4 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 20 20" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16Z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m17 17-3-3" />
        </svg>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search cameras, incidents, alerts..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-sm text-zinc-950 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 min-w-[200px]"
        />
        {query && (
          <Button
            plain
            onClick={() => {
              setQuery('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="h-4 w-4 p-0"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>

      {isOpen && (query.length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                Search Results ({results.length})
              </div>
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result.href)}
                  className="w-full px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    {result.type === 'camera' && (
                      <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
                        </svg>
                      </div>
                    )}
                    {result.type === 'incident' && (
                      <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 2L2 7v11h16V7L10 2Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 10v6M7 12h6" />
                        </svg>
                      </div>
                    )}
                    {result.type === 'alert' && (
                      <div className="h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                        <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 3v2m0 10v2m7-7h-2M5 10H3m14.364 5.364L15.536 16.95M4.464 3.05 3.05 4.464m13.436 11.072L16.95 15.536M6.464 4.95 5.05 3.536" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-950 dark:text-white truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  {result.badge && (
                    <Badge color={result.badge.color} className="flex-shrink-0">
                      {result.badge.text}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No results found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
