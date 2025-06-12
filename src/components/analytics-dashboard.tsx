"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Clock, Target, Calendar } from "lucide-react"
import type { Task } from "@/types/task"
import { calculateTaskStats, formatDuration } from "@/lib/task-utils"

interface AnalyticsDashboardProps {
  tasks: Task[]
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const stats = calculateTaskStats(tasks)

  // Calculate additional analytics
  const tasksByPriority = {
    tinggi: tasks.filter((t) => t.priority === "tinggi").length,
    sedang: tasks.filter((t) => t.priority === "sedang").length,
    rendah: tasks.filter((t) => t.priority === "rendah").length,
  }

  const tasksByCategory = tasks.reduce(
    (acc, task) => {
      if (task.category) {
        acc[task.category] = (acc[task.category] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const completedThisWeek = tasks.filter((task) => {
    if (!task.completedAt) return false
    const completedDate = new Date(task.completedAt)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return completedDate >= weekAgo
  }).length

  const avgTasksPerDay = tasks.length > 0 ? (tasks.length / 30).toFixed(1) : "0"

  const productivityScore = Math.round(stats.completionRate * 0.6 + completedThisWeek * 10 * 0.4)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skor Produktivitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productivityScore}/100</div>
            <Progress value={productivityScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Berdasarkan completion rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai Minggu Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              {completedThisWeek > 0 ? `+${((completedThisWeek / stats.completed) * 100).toFixed(1)}%` : "0%"} dari
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Tugas/Hari</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTasksPerDay}</div>
            <p className="text-xs text-muted-foreground">Berdasarkan 30 hari terakhir</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waktu Rata-rata</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.avgCompletionTime > 0 ? formatDuration(stats.avgCompletionTime) : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Per tugas yang diselesaikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Prioritas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(tasksByPriority).map(([priority, count]) => {
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
              return (
                <div key={priority} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          priority === "tinggi" ? "destructive" : priority === "sedang" ? "default" : "secondary"
                        }
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Badge>
                      <span className="text-sm">{count} tugas</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Analysis */}
      {Object.keys(tasksByCategory).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analisis Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(tasksByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, count]) => {
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{count} tugas</span>
                          <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Performa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-muted-foreground">Tugas Selesai</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">Sedang Dikerjakan</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.total - stats.completed - stats.inProgress}</div>
              <div className="text-sm text-muted-foreground">Belum Dimulai</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
