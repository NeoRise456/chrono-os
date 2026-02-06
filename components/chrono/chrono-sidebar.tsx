"use client"

import {
  Calendar,
  CheckSquare,
  Target,
  Repeat,
  Settings,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery, useConvexAuth } from "convex/react"
import { api } from "@/convex/_generated/api"
import { authClient } from "@/lib/auth-client"

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
    title: "Habits",
    href: "/habits",
    icon: Repeat,
  },
  {
    title: "Schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    title: "Todos",
    href: "/todos",
    icon: CheckSquare,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Target,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function ChronoSidebar() {
  const pathname = usePathname()
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip")

return (
    <Sidebar collapsible="offcanvas" className="border-r border-border">
      <SidebarHeader className="h-16 px-6 border-b border-border flex flex-row items-center">
        <span className="w-3 h-3 bg-foreground mr-3" aria-hidden="true" />
        <h1 className="text-lg font-bold tracking-widest font-display">
          CHRONO_OS
        </h1>
      </SidebarHeader>
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 px-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`
                        flex items-center gap-4 px-4 py-3 text-sm font-medium font-display
                        rounded-none border-l-2
                        ${
                          isActive
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
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-6">
        <div className="space-y-4">
          {user ? (
            <>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                {user.image && (
                  <img
                    src={user.image}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate font-display">
                    {user.name || "User"}
                  </p>
                  {user.email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => authClient.signOut()}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-display w-full"
              >
                <LogOut className="size-[18px]" aria-hidden="true" />
                <span>SIGN_OUT</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-muted-foreground font-display">
              LOADING_USER...
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
