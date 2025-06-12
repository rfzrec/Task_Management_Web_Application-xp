"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { TaskStatsComponent } from "@/components/task-stats"
import { TaskFilters } from "@/components/task-filters"
import { TaskBoard } from "@/components/task-board"
import { TaskForm } from "@/components/task-form"
import { CalendarView } from "@/components/calendar-view"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Circle } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import { useNotifications } from "@/hooks/use-notifications"
import { exportTasksToJSON } from "@/lib/task-utils"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Task } from "@/types/task"

export default function TaskManagement() {
  const {
    tasks,
    tasksByStatus,
    filter,
    stats,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    setFilter,
    importTasks,
  } = useTasks()

  const { unreadCount } = useNotifications()
  const [activeView, setActiveView] = useState("dashboard")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    addTask(taskData)
  }

  const handleUpdateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData)
      setEditingTask(null)
    }
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  const handleExport = () => {
    const dataStr = exportTasksToJSON(tasks)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `tasks-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const renderMainContent = () => {
    switch (activeView) {
      case "calendar":
        return <CalendarView tasks={tasks} onTaskClick={handleEditTask} />
      case "analytics":
        return <AnalyticsDashboard tasks={tasks} />
      case "tasks":
        return (
          <div className="space-y-6">
            <TaskFilters
              filter={filter}
              onFilterChange={setFilter}
              tasks={tasks}
              onExport={handleExport}
              onImport={importTasks}
            />
            <div className="mb-6">
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Tugas Baru
              </Button>
            </div>
            {tasks.length > 0 ? (
              <TaskBoard
                tasksByStatus={tasksByStatus}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
                onStatusChange={updateTaskStatus}
              />
            ) : (
              <Card className="mt-8">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Circle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada tugas</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Mulai dengan menambahkan tugas pertama Anda untuk mengelola pekerjaan dengan lebih baik.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Tugas Pertama
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">Dashboard Manajemen Tugas</h1>
              <p className="text-gray-600 dark:text-gray-400">Kelola tugas Anda dengan efisien dan terorganisir</p>
            </div>
            <TaskStatsComponent stats={stats} />
            <div className="mb-6">
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Tambah Tugas Baru
              </Button>
            </div>
            {tasks.length > 0 ? (
              <TaskBoard
                tasksByStatus={tasksByStatus}
                onEditTask={handleEditTask}
                onDeleteTask={deleteTask}
                onStatusChange={updateTaskStatus}
              />
            ) : (
              <Card className="mt-8">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Circle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Belum ada tugas</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Mulai dengan menambahkan tugas pertama Anda untuk mengelola pekerjaan dengan lebih baik.
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Tugas Pertama
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar activeView={activeView} onViewChange={setActiveView} unreadNotifications={unreadCount} />

        <main className="flex-1 flex flex-col">
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 p-6 overflow-auto">{renderMainContent()}</div>
        </main>

        <TaskForm
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          editingTask={editingTask}
        />
      </div>
    </SidebarProvider>
  )
}
