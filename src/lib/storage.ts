import type { Task } from "@/types/task"

const STORAGE_KEY = "tasks"

export const loadTasks = (): Task[] => {
  if (typeof window === "undefined") return []

  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY)
    return savedTasks ? JSON.parse(savedTasks) : []
  } catch (error) {
    console.error("Error loading tasks:", error)
    return []
  }
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch (error) {
    console.error("Error saving tasks:", error)
  }
}

export const generateTaskId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
