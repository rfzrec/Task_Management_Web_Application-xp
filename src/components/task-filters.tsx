"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Filter, Search, Download, Upload } from "lucide-react"
import type { TaskFilter, Task } from "@/types/task"

interface TaskFiltersProps {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
  tasks: Task[]
  onExport: () => void
  onImport: (tasks: Task[]) => void
}

export function TaskFilters({ filter, onFilterChange, tasks, onExport, onImport }: TaskFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [tempFilter, setTempFilter] = useState<TaskFilter>(filter)

  // Get unique values for filter options
  const categories = Array.from(new Set(tasks.map((task) => task.category).filter(Boolean))) as string[]
  const tags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])))
  const assignees = Array.from(new Set(tasks.map((task) => task.assignee).filter(Boolean))) as string[]

  const handleApplyFilter = () => {
    onFilterChange(tempFilter)
    setIsFilterOpen(false)
  }

  const handleClearFilter = () => {
    const clearedFilter = {} as TaskFilter
    setTempFilter(clearedFilter)
    onFilterChange(clearedFilter)
  }

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const importedTasks = JSON.parse(content)
          if (Array.isArray(importedTasks)) {
            onImport(importedTasks)
          }
        } catch (error) {
          alert("Error importing file. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const activeFilterCount = Object.keys(filter).length

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari tugas..."
            value={filter.search || ""}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Filter Tugas</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["to-do", "in-progress", "done"] as const).map((status) => (
                      <Button
                        key={status}
                        variant={tempFilter.status?.includes(status) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentStatus = tempFilter.status || []
                          const newStatus = currentStatus.includes(status)
                            ? currentStatus.filter((s) => s !== status)
                            : [...currentStatus, status]
                          setTempFilter({ ...tempFilter, status: newStatus })
                        }}
                      >
                        {status === "to-do" ? "To-Do" : status === "in-progress" ? "In Progress" : "Done"}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Prioritas</Label>
                  <div className="flex flex-wrap gap-2">
                    {(["rendah", "sedang", "tinggi"] as const).map((priority) => (
                      <Button
                        key={priority}
                        variant={tempFilter.priority?.includes(priority) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentPriority = tempFilter.priority || []
                          const newPriority = currentPriority.includes(priority)
                            ? currentPriority.filter((p) => p !== priority)
                            : [...currentPriority, priority]
                          setTempFilter({ ...tempFilter, priority: newPriority })
                        }}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {categories.length > 0 && (
                <div className="space-y-2">
                  <Label>Kategori</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={tempFilter.category?.includes(category) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentCategory = tempFilter.category || []
                          const newCategory = currentCategory.includes(category)
                            ? currentCategory.filter((c) => c !== category)
                            : [...currentCategory, category]
                          setTempFilter({ ...tempFilter, category: newCategory })
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {tags.map((tag) => (
                      <Button
                        key={tag}
                        variant={tempFilter.tags?.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const currentTags = tempFilter.tags || []
                          const newTags = currentTags.includes(tag)
                            ? currentTags.filter((t) => t !== tag)
                            : [...currentTags, tag]
                          setTempFilter({ ...tempFilter, tags: newTags })
                        }}
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Tanggal Mulai</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={tempFilter.dueDateRange?.start || ""}
                    onChange={(e) =>
                      setTempFilter({
                        ...tempFilter,
                        dueDateRange: { ...tempFilter.dueDateRange, start: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Tanggal Akhir</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={tempFilter.dueDateRange?.end || ""}
                    onChange={(e) =>
                      setTempFilter({
                        ...tempFilter,
                        dueDateRange: { ...tempFilter.dueDateRange, end: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClearFilter}>
                Clear All
              </Button>
              <Button onClick={handleApplyFilter}>Apply Filter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={onExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>

        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
    </div>
  )
}
