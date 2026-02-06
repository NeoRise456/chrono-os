import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChronoSidebar } from "@/components/chrono/chrono-sidebar";

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <ChronoSidebar />
      <SidebarInset>
        <header className="h-16 border-b border-border px-6 flex items-center gap-4">
          <SidebarTrigger />
          <h1 className="text-lg font-bold tracking-widest font-display">PROFILE</h1>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <p className="text-4xl font-display font-bold tracking-widest">COMING_SOON</p>
            <p className="text-muted-foreground">Profile module under development.</p>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
