"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Circle } from "lucide-react"
import { TaskCard } from "./task-card"
import type { Task, TaskStatus } from "@/types/task"

const statusIcons = {
  "to-do": Circle,
  "in-progress": Clock,
  done: CheckCircle2,
}

interface TaskBoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

export function TaskBoard({ tasksByStatus, onEditTask, onDeleteTask, onStatusChange }: TaskBoardProps) {
  const statusLabels = {
    "to-do": "To-Do",
    "in-progress": "In Progress",
    done: "Done",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
        const StatusIcon = statusIcons[status as TaskStatus]

        return (
          <div key={status} className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              <h2 className="text-lg font-semibold">{statusLabels[status as TaskStatus]}</h2>
              <Badge variant="secondary">{statusTasks.length}</Badge>
            </div>

            <div className="space-y-3">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                />
              ))}

              {statusTasks.length === 0 && (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center py-8">
                    <p className="text-muted-foreground text-sm">Tidak ada tugas dalam status ini</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
