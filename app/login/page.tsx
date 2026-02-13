"use client"

import Link from "next/link"
import { Github, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"



function SyncTime() {
  const [time, setTime] = useState<string | null>(null);


  useEffect(() => {
    const updateTime = () => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(new Date())
      setTime(formatted)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!time) {
    return <span className="tabular-nums">--:--:-- --</span>
  }

  return (
    <time dateTime={new Date().toISOString()} className="tabular-nums">
      {time}
    </time>
  )
}

export default function LoginPage() {

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/habits";

  async function handleGithubSignIn() {
    const {error} = await authClient.signIn.social({
      provider: "github",
      callbackURL: callbackUrl
    });


  }

  return (
    <div className="flex min-h-screen flex-col font-display bg-background">
      <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
        <div className="h-16 px-6 border-b border-border flex flex-row items-center">
          <span className="w-3 h-3 bg-foreground mr-3" aria-hidden="true" />
          <h1 className="text-lg font-bold tracking-widest font-display">
            CHRONO_OS // AUTH_SYSTEM
          </h1>
        </div>
        <span className="text-xs text-muted-foreground border border-border px-2 py-1 font-display uppercase flex items-center gap-2">
          <Clock className="size-3" aria-hidden="true" />
          <SyncTime />
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-24 ">
        <div className="text-center space-y-8 max-w-sm w-full tech-full-border border border-border p-8">
          <div className="shrink-0 flex items-center justify-between text-left">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5 font-display">
                eyo hru?
              </p>
              <h1 className="text-xl font-bold text-foreground font-display ">
                Login to your account
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full justify-start" 
              onClick={() => handleGithubSignIn()}
              >
                <Github className="mr-2 h-4 w-4" />
                Github
            </Button>

            
          </div>
        </div>
      </main>

      <footer className="p-6 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row justify-between md:justify-end items-center gap-4 text-right text-[10px]">
        
        <span>Made with &lt;3 By <Link href="https://juanastonitas.is-a.dev/" className="text-zinc-500 hover:text-zinc-300">NeoRise</Link></span>
      </footer>
    </div>
  )
}
