export interface Task {
  id: string
  title: string
  description: string
  priority: "rendah" | "sedang" | "tinggi"
  status: "to-do" | "in-progress" | "done"
  category?: string
  tags: string[]
  assignee?: string
  dueDate?: string
  estimatedTime?: number
  actualTime?: number
  completedAt?: string
  createdAt: string
  updatedAt?: string
}

export type TaskStatus = Task["status"]
export type TaskPriority = Task["priority"]

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  completionRate: number
  avgCompletionTime: number
}

export interface TaskFilter {
  search?: string
  status?: TaskStatus[]
  priority?: TaskPriority[]
  category?: string[]
  tags?: string[]
  assignee?: string[]
  dueDateRange?: {
    start?: string
    end?: string
  }
}

export const priorityOrder = { tinggi: 3, sedang: 2, rendah: 1 }

export const priorityColors = {
  tinggi: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
  sedang: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
  rendah: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100",
}

export const statusColors = {
  "to-do": "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-100",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
  done: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100",
}
