import type { Task, TaskFilter, TaskStats } from "@/types/task"

export const priorityOrder = { tinggi: 3, sedang: 2, rendah: 1 }

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  return tasks.filter((task) => {
    // Status filter
    if (filter.status && filter.status.length > 0 && !filter.status.includes(task.status)) {
      return false
    }

    // Priority filter
    if (filter.priority && filter.priority.length > 0 && !filter.priority.includes(task.priority)) {
      return false
    }

    // Category filter
    if (filter.category && filter.category.length > 0 && task.category && !filter.category.includes(task.category)) {
      return false
    }

    // Tags filter
    if (filter.tags && filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some((tag) => task.tags?.includes(tag))
      if (!hasMatchingTag) return false
    }

    // Assignee filter
    if (filter.assignee && filter.assignee.length > 0 && task.assignee && !filter.assignee.includes(task.assignee)) {
      return false
    }

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        (task.tags && task.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      if (!matchesSearch) return false
    }

    // Due date filter
    if (filter.dueDateRange) {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      if (filter.dueDateRange.start && taskDate < new Date(filter.dueDateRange.start)) return false
      if (filter.dueDateRange.end && taskDate > new Date(filter.dueDateRange.end)) return false
    }

    return true
  })
}

export const calculateTaskStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length
  const completed = tasks.filter((task) => task.status === "done").length
  const inProgress = tasks.filter((task) => task.status === "in-progress").length

  const completionRate = total > 0 ? (completed / total) * 100 : 0

  const completedTasks = tasks.filter((task) => task.status === "done" && task.actualTime)
  const avgCompletionTime =
    completedTasks.length > 0
      ? completedTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0) / completedTasks.length
      : 0

  return {
    total,
    completed,
    inProgress,
    completionRate,
    avgCompletionTime,
  }
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export const exportTasksToJSON = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2)
}

export const importTasksFromJSON = (jsonString: string): Task[] => {
  try {
    const parsed = JSON.parse(jsonString)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
