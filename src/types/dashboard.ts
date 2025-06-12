export interface DashboardWidget {
  id: string
  title: string
  type: "stats" | "chart" | "list" | "calendar" | "timer" | "notes"
  position: { x: number; y: number }
  size: { width: number; height: number }
  visible: boolean
  config?: Record<string, any>
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  language: "id" | "en"
  notifications: {
    deadlines: boolean
    assignments: boolean
    completions: boolean
    reminders: boolean
  }
  dashboard: {
    layout: DashboardWidget[]
    autoSave: boolean
    refreshInterval: number
  }
}

export interface Notification {
  id: string
  type: "deadline" | "assignment" | "completion" | "reminder" | "info"
  title: string
  message: string
  taskId?: string
  createdAt: string
  read: boolean
  priority: "low" | "medium" | "high"
}

export interface TaskTemplate {
  id: string
  name: string
  description: string
  defaultPriority: "rendah" | "sedang" | "tinggi"
  defaultCategory: string
  defaultTags: string[]
  defaultEstimatedTime?: number
  checklist: string[]
  createdAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  author: string
  content: string
  createdAt: string
  mentions: string[]
}

export interface ProjectMilestone {
  id: string
  title: string
  description: string
  dueDate: string
  tasks: string[]
  completed: boolean
  createdAt: string
}
