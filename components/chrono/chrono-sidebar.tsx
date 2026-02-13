"use client"

import {
  Calendar,
  CheckSquare,
  Target,
  Repeat,
  LogOut,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  }
]

export function ChronoSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated } = useConvexAuth()
  const user = useQuery(api.auth.getCurrentUser, isAuthenticated ? {} : "skip")

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/login")
  }

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
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full border-t border-border p-2 text-left hover:bg-accent/50 transition-colors group">
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
                <ChevronDown className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="min-w-[200px] border-2 bg-background font-display"
            >
              <DropdownMenuItem
                onClick={handleSignOut}
                variant="destructive"
                className="cursor-pointer font-display tracking-wider text-sm"
              >
                <LogOut className="size-4" />
                <span>SIGN_OUT</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="text-xs text-muted-foreground font-display">
            LOADING_USER...
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
