import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 font-display">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-4 h-4 bg-foreground" aria-hidden="true" />
            <h1 className="text-3xl font-bold tracking-widest">NEO LIFE PLANNER</h1>
          </div>
          <p className="text-muted-foreground text-sm uppercase tracking-wider">
            Track and optimize your daily habits with precision
          </p>
        </div>
        
        <div className="pt-8">
          <Link
            href="/example"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium tracking-wider uppercase"
          >
            View Demo Dashboard
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        <p className="text-xs text-muted-foreground pt-8">
          Next.js + Convex + Tailwind CSS + TypeScript
        </p>
      </div>
    </main>
  )
}
