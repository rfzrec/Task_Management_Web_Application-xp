"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  editingTask?: Task | null
}

export function TaskForm({ isOpen, onClose, onSubmit, editingTask }: TaskFormProps) {
  const [formData, setFormData] = useState<Omit<Task, "id" | "createdAt" | "updatedAt">>({
    title: "",
    description: "",
    priority: "sedang" as TaskPriority,
    status: "to-do" as TaskStatus,
    tags: [],
  })

  useEffect(() => {
    if (editingTask) {
      const { id, createdAt, updatedAt, ...rest } = editingTask
      setFormData({
        ...rest,
        tags: rest.tags || [],
      })
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "sedang",
        status: "to-do",
        tags: [],
      })
    }
  }, [editingTask, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onSubmit(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      priority: "sedang",
      status: "to-do",
      tags: [],
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? "Edit Tugas" : "Tambah Tugas Baru"}</DialogTitle>
          <DialogDescription>
            {editingTask ? "Perbarui informasi tugas" : "Buat tugas baru dengan detail lengkap"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Tugas</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul tugas"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi tugas"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioritas</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: TaskPriority) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rendah">Rendah</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="tinggi">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-do">To-Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button type="submit">{editingTask ? "Perbarui" : "Tambah"} Tugas</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
