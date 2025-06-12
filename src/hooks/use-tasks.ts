"use client"

import { useState, useEffect } from "react"
import type { Task, TaskStatus, TaskFilter } from "@/types/task"
import { loadTasks, saveTasks, generateTaskId } from "@/lib/storage"
import { priorityOrder, filterTasks, calculateTaskStats } from "@/lib/task-utils"

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>({})

  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      id: generateTaskId(),
      ...taskData,
      tags: taskData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    const updates: Partial<Task> = { status }
    if (status === "done") {
      updates.completedAt = new Date().toISOString()
    }
    updateTask(id, updates)
  }

  const importTasks = (importedTasks: Task[]) => {
    const validTasks = importedTasks.filter((task) => task.id && task.title && task.priority && task.status)
    setTasks((prev) => [...prev, ...validTasks])
  }

  // Filter and sort tasks
  const filteredTasks = filterTasks(tasks, filter)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const tasksByStatus = {
    "to-do": sortedTasks.filter((task) => task.status === "to-do"),
    "in-progress": sortedTasks.filter((task) => task.status === "in-progress"),
    done: sortedTasks.filter((task) => task.status === "done"),
  }

  const stats = calculateTaskStats(filteredTasks)

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    sortedTasks,
    tasksByStatus,
    filter,
    stats,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilter,
    importTasks,
  }
}
