import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold font-display tracking-widest">404</h1>
          <p className="text-xl text-muted-foreground font-display">ROUTE_NOT_FOUND</p>
        </div>
        <p className="text-muted-foreground max-w-md">
          The requested resource could not be located in the system.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-foreground text-background font-display font-bold tracking-wider hover:opacity-90 transition-opacity"
        >
          RETURN_HOME
        </Link>
      </div>
    </div>
  );
}
