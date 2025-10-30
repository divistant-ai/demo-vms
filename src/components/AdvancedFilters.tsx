import { useState } from 'react'
import { Heading } from './catalyst/heading'
import { Button } from './catalyst/button'
import { Input } from './catalyst/input'
import { Select } from './catalyst/select'
import { Field, Label } from './catalyst/fieldset'
import { Dialog, DialogTitle, DialogBody, DialogActions } from './catalyst/dialog'
import { Badge } from './catalyst/badge'
import { Text } from './catalyst/text'

export interface FilterConfig {
  id: string
  name: string
  filters: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

interface AdvancedFiltersProps {
  filters: Record<string, any>
  onFiltersChange: (filters: Record<string, any>) => void
  onSaveFilter?: (name: string, filters: Record<string, any>) => void
  onLoadFilter?: (filterId: string) => void
  onDeleteFilter?: (filterId: string) => void
  savedFilters?: FilterConfig[]
  filterFields: Array<{
    key: string
    label: string
    type: 'text' | 'select' | 'date' | 'number'
    options?: Array<{ value: string; label: string }>
  }>
  className?: string
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  savedFilters = [],
  filterFields,
  className = ''
}: AdvancedFiltersProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [showSavedFilters, setShowSavedFilters] = useState(false)

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleSaveFilter = () => {
    if (filterName.trim() && onSaveFilter) {
      onSaveFilter(filterName.trim(), filters)
      setFilterName('')
      setShowSaveDialog(false)
    }
  }

  const handleLoadFilter = (filterId: string) => {
    if (onLoadFilter) {
      onLoadFilter(filterId)
    }
    setShowSavedFilters(false)
  }

  const handleDeleteFilter = (filterId: string) => {
    if (onDeleteFilter) {
      onDeleteFilter(filterId)
    }
  }

  const handleClearFilters = () => {
    const clearedFilters: Record<string, any> = {}
    filterFields.forEach(field => {
      clearedFilters[field.key] = field.type === 'select' ? 'all' : ''
    })
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all' && value !== null && value !== undefined
  )

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Heading level={3}>Filters</Heading>
        <div className="flex items-center gap-2">
          {savedFilters.length > 0 && (
            <Button
              plain
              onClick={() => setShowSavedFilters(true)}
              className="text-sm"
            >
              Saved Filters ({savedFilters.length})
            </Button>
          )}
          {onSaveFilter && hasActiveFilters && (
            <Button
              plain
              onClick={() => setShowSaveDialog(true)}
              className="text-sm"
            >
              Save Current
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              plain
              onClick={handleClearFilters}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filterFields.map((field) => (
          <Field key={field.key}>
            <Label>{field.label}</Label>
            {field.type === 'text' && (
              <Input
                type="text"
                value={filters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                placeholder={`Filter by ${field.label.toLowerCase()}...`}
              />
            )}
            {field.type === 'select' && (
              <Select
                value={filters[field.key] || 'all'}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
              >
                <option value="all">All {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            )}
            {field.type === 'date' && (
              <Input
                type="date"
                value={filters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
              />
            )}
            {field.type === 'number' && (
              <Input
                type="number"
                value={filters[field.key] || ''}
                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                placeholder={`Filter by ${field.label.toLowerCase()}...`}
              />
            )}
          </Field>
        ))}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">Active filters:</Text>
          {Object.entries(filters).map(([key, value]) => {
            if (value === '' || value === 'all' || value === null || value === undefined) return null
            
            const field = filterFields.find(f => f.key === key)
            const displayValue = field?.options?.find(opt => opt.value === value)?.label || value
            
            return (
              <Badge
                key={key}
                color="blue"
                className="cursor-pointer"
                onClick={() => handleFilterChange(key, field?.type === 'select' ? 'all' : '')}
              >
                {field?.label}: {displayValue} ×
              </Badge>
            )
          })}
        </div>
      )}

      {/* Save Filter Dialog */}
      <Dialog open={showSaveDialog} onClose={() => setShowSaveDialog(false)}>
        <DialogTitle>Save Filter</DialogTitle>
        <DialogBody>
          <Field>
            <Label>Filter Name</Label>
            <Input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Enter a name for this filter..."
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowSaveDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
            Save Filter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Saved Filters Dialog */}
      <Dialog open={showSavedFilters} onClose={() => setShowSavedFilters(false)}>
        <DialogTitle>Saved Filters</DialogTitle>
        <DialogBody>
          {savedFilters.length === 0 ? (
            <Text className="text-center text-zinc-500 dark:text-zinc-400 py-4">
              No saved filters yet
            </Text>
          ) : (
            <div className="space-y-2">
              {savedFilters.map((filter) => (
                <div
                  key={filter.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800"
                >
                  <div>
                    <Text className="font-medium">{filter.name}</Text>
                    <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                      Created {new Date(filter.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      plain
                      onClick={() => handleLoadFilter(filter.id)}
                      className="text-sm"
                    >
                      Load
                    </Button>
                    {onDeleteFilter && (
                      <Button
                        plain
                        onClick={() => handleDeleteFilter(filter.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setShowSavedFilters(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
