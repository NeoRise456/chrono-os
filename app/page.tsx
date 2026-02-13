import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 font-display">
      <div className="text-center space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-4 h-4 bg-foreground" aria-hidden="true" />
            <h1 className="text-3xl font-bold tracking-widest">CHRONO_OS</h1>
          </div>
          <p className="text-muted-foreground text-sm uppercase tracking-wider">
            Track and optimize your daily habits with precision
          </p>
          <span className="text-xs text-muted-foreground"> 
             
            <Link href="https://github.com/NeoRise456/chrono-os" className="text-muted-foreground hover:text-foreground hover:underline transition-colors">
            &gt; github repo &lt; 
            </Link> 
          </span>
          
        </div>
        
        <div className="pt-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium tracking-wider uppercase"
          >
            Login
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        
        <p className="text-xs text-muted-foreground pt-8">
          Next.js + Convex (and a bunch of otherstuff)
        </p>
      </div>
    </main>
  )
}
