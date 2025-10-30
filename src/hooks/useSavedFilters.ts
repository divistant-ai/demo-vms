import { useState, useEffect } from 'react'
import type { FilterConfig } from '../components/AdvancedFilters'

const STORAGE_KEY = 'vms-saved-filters'

export function useSavedFilters() {
  const [savedFilters, setSavedFilters] = useState<FilterConfig[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const filters = JSON.parse(stored).map((filter: any) => ({
          ...filter,
          createdAt: new Date(filter.createdAt),
          updatedAt: new Date(filter.updatedAt)
        }))
        setSavedFilters(filters)
      } catch (error) {
        console.error('Failed to load saved filters:', error)
      }
    }
  }, [])

  const saveFilter = (name: string, filters: Record<string, any>) => {
    const newFilter: FilterConfig = {
      id: `filter-${Date.now()}`,
      name,
      filters,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const updatedFilters = [...savedFilters, newFilter]
    setSavedFilters(updatedFilters)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters))
  }

  const loadFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId)
    return filter?.filters || {}
  }

  const deleteFilter = (filterId: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== filterId)
    setSavedFilters(updatedFilters)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters))
  }

  return {
    savedFilters,
    saveFilter,
    loadFilter,
    deleteFilter
  }
}
