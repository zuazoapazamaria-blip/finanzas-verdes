import { BottomNav } from "@/components/BottomNav";
import { Outlet } from "@tanstack/react-router";

export function Layout() {
  const year = new Date().getFullYear();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <span className="font-display text-sm font-bold">₲</span>
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-foreground">
              Mi Cartera
            </span>
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Finanzas
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-28 pt-5">
        <Outlet />
      </main>

      <footer className="mx-auto w-full max-w-md px-4 pb-24 pt-2">
        <p className="text-center text-xs text-muted-foreground">
          © {year}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline-offset-4 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <BottomNav />
    </div>
  );
}
