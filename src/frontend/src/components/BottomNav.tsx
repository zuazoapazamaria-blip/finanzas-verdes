import { Link } from "@tanstack/react-router";
import { type LucideIcon, PieChart, PlusCircle, Wallet } from "lucide-react";

interface NavItem {
  to: "/" | "/registro" | "/analisis";
  label: string;
  icon: LucideIcon;
  ocid: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Resumen", icon: Wallet, ocid: "nav.summary" },
  {
    to: "/registro",
    label: "Registro",
    icon: PlusCircle,
    ocid: "nav.registro",
  },
  { to: "/analisis", label: "Análisis", icon: PieChart, ocid: "nav.analisis" },
];

export function BottomNav() {
  return (
    <nav
      data-ocid="nav.bottom"
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md shadow-nav safe-bottom"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, ocid }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              data-ocid={ocid}
              activeOptions={{ exact: to === "/" }}
              className="group flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold tracking-wide text-muted-foreground transition-smooth hover:text-foreground"
              activeProps={{ className: "text-accent" }}
            >
              <span className="flex h-8 w-12 items-center justify-center rounded-full bg-transparent transition-smooth group-hover:bg-muted group-aria-[current=page]:bg-accent/15">
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
