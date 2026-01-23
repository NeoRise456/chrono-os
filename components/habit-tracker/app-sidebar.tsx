"use client"

import {
  LayoutDashboard,
  CheckSquare,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Book,
} from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "#",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Habits",
    href: "#habits",
    icon: CheckSquare,
    isActive: false,
  },
  {
    title: "History",
    href: "#history",
    icon: History,
    isActive: false,
  },
  {
    title: "Statistics",
    href: "#statistics",
    icon: BarChart3,
    isActive: false,
  },
  {
    title: "Settings",
    href: "#settings",
    icon: Settings,
    isActive: false,
  },
]

const helpItems = [
  {
    title: "Help Center",
    href: "#help",
    icon: HelpCircle,
  },
  {
    title: "User Guide",
    href: "#guide",
    icon: Book,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="none" className="border-r border-border">
      <SidebarHeader className="h-16 px-6 border-b border-border flex flex-row items-center">
        <span className="w-3 h-3 bg-foreground mr-3" aria-hidden="true" />
        <h1 className="text-lg font-bold tracking-widest font-display">
          HABIT_OS
        </h1>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    className={`
                      flex items-center gap-4 px-4 py-3 text-sm font-medium font-display
                      rounded-none border-l-2
                      ${
                        item.isActive
                          ? "bg-accent text-foreground border-foreground"
                          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-accent/50"
                      }
                      transition-colors
                    `}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-6">
        <nav className="space-y-4" aria-label="Help navigation">
          {helpItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-display"
            >
              <item.icon className="size-[18px]" aria-hidden="true" />
              {item.title}
            </Link>
          ))}
        </nav>
      </SidebarFooter>
    </Sidebar>
  )
}
