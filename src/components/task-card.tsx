"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, CheckCircle2, Clock, Circle } from "lucide-react"
import type { Task, TaskStatus } from "@/types/task"
import { priorityColors, statusColors } from "@/types/task"

const statusIcons = {
  "to-do": Circle,
  "in-progress": Clock,
  done: CheckCircle2,
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const StatusIcon = statusIcons[task.status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base mb-2">{task.title}</CardTitle>
            <div className="flex gap-2 mb-2">
              <Badge className={priorityColors[task.priority]}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
              <Badge className={statusColors[task.status]}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {task.status === "to-do" ? "To-Do" : task.status === "in-progress" ? "In Progress" : "Done"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(task)} className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent className="pt-0">
          <CardDescription className="text-sm">{task.description}</CardDescription>
        </CardContent>
      )}
      <CardContent className="pt-0">
        <div className="flex gap-1">
          {(["to-do", "in-progress", "done"] as const).map((statusOption) => (
            <Button
              key={statusOption}
              variant={task.status === statusOption ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange(task.id, statusOption)}
              className="text-xs"
            >
              {statusOption === "to-do" ? "To-Do" : statusOption === "in-progress" ? "Progress" : "Done"}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
