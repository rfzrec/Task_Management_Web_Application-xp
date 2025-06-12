"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Users,
  FileText,
  Clock,
  Target,
  Bookmark,
  MessageSquare,
  Download,
  Upload,
  Moon,
  Sun,
  User,
} from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { useNotifications } from "@/hooks/use-notifications"

interface DashboardSidebarProps {
  activeView: string
  onViewChange: (view: string) => void
  unreadNotifications: number
}

export function DashboardSidebar({ activeView, onViewChange, unreadNotifications }: DashboardSidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const { notifications } = useNotifications()

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tasks", label: "Tugas", icon: CheckSquare },
    { id: "calendar", label: "Kalender", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "team", label: "Tim", icon: Users },
    { id: "templates", label: "Template", icon: FileText },
    { id: "milestones", label: "Milestone", icon: Target },
  ]

  const toolsMenuItems = [
    { id: "timer", label: "Timer", icon: Clock },
    { id: "notes", label: "Catatan", icon: Bookmark },
    { id: "comments", label: "Komentar", icon: MessageSquare },
    { id: "notifications", label: "Notifikasi", icon: Bell, badge: unreadNotifications },
  ]

  const dataMenuItems = [
    { id: "export", label: "Export Data", icon: Download },
    { id: "import", label: "Import Data", icon: Upload },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">TaskFlow</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <div className="space-y-4">
          {/* Main Navigation */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Navigasi Utama
            </h3>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>

          {/* Tools */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tools</h3>
            <SidebarMenu>
              {toolsMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto h-5 w-5 flex items-center justify-center p-0">
                        {item.badge > 99 ? "99+" : item.badge}
                      </Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Data Management
            </h3>
            <SidebarMenu>
              {dataMenuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-2">
          {/* Theme Toggle */}
          <Button variant="ghost" onClick={toggleTheme} className="w-full justify-start gap-2">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </Button>

          {/* Settings */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeView === "settings"}
                onClick={() => onViewChange("settings")}
                className="w-full justify-start"
              >
                <Settings className="h-4 w-4" />
                <span>Pengaturan</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* User Profile */}
          <div className="border-t pt-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="w-full justify-start">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
