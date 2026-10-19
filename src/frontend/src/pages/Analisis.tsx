import { CategoryChart } from "@/components/CategoryChart";
import { CategoryProgress } from "@/components/CategoryProgress";
import { useSummary } from "@/hooks/useTransactions";
import { CATEGORIES } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryTotal } from "@/types";
import { Link } from "@tanstack/react-router";
import { BarChart3, PlusCircle } from "lucide-react";

function EmptyState() {
  return (
    <div
      data-ocid="analisis.empty_state"
      className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <BarChart3 className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold tracking-tight text-foreground">
        Aún no hay gastos
      </h2>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Registra tu primer gasto para ver cómo se distribuye por categoría.
      </p>
      <Link
        to="/registro"
        data-ocid="analisis.empty_state.primary_button"
        className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-smooth hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <PlusCircle className="h-4 w-4" aria-hidden="true" />
        Registrar gasto
      </Link>
    </div>
  );
}

function LoadingState() {
  const ids = Array.from({ length: 3 }, (_, i) => `analisis-skeleton-${i}`);
  return (
    <div data-ocid="analisis.loading_state" className="space-y-4">
      <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="h-40 animate-pulse rounded-2xl border border-border bg-card" />
      <span className="sr-only">Cargando análisis…</span>
      {ids.map((id) => (
        <span key={id} className="hidden" />
      ))}
    </div>
  );
}

export function AnalisisPage() {
  const { data: summary, isLoading, isError, refetch } = useSummary();

  const byCategory = summary?.byCategory ?? [];
  const totalExpense = summary?.totalExpense ?? 0n;

  const ordered: CategoryTotal[] = CATEGORIES.map((meta) => {
    const found = byCategory.find((entry) => entry.category === meta.key);
    return { category: meta.key, total: found?.total ?? 0n };
  });

  const topCategory = ordered.reduce<CategoryTotal | null>((best, entry) => {
    if (entry.total <= 0n) return best;
    if (!best || entry.total > best.total) return entry;
    return best;
  }, null);

  const hasExpenses = totalExpense > 0n;

  return (
    <section data-ocid="page.analisis" className="space-y-5">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Análisis
        </h1>
        <p className="text-sm text-muted-foreground">
          Consulta cómo se distribuye tu gasto por categoría.
        </p>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <div
          data-ocid="analisis.error_state"
          className="rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-center"
        >
          <p className="text-sm font-medium text-foreground">
            No pudimos cargar tu análisis.
          </p>
          <button
            type="button"
            data-ocid="analisis.error_state.retry_button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground transition-smooth hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Reintentar
          </button>
        </div>
      ) : !hasExpenses ? (
        <EmptyState />
      ) : (
        <>
          <div
            data-ocid="analisis.total_card"
            className="rounded-2xl border border-border bg-gradient-balance p-4 shadow-subtle"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Gasto total
            </p>
            <p className="tabular mt-1 font-display text-3xl font-bold tracking-tight text-foreground">
              {formatCurrency(totalExpense)}
            </p>
            {topCategory ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Mayor gasto en{" "}
                <span className="font-semibold text-accent">
                  {
                    CATEGORIES.find((m) => m.key === topCategory.category)
                      ?.label
                  }
                </span>
              </p>
            ) : null}
          </div>

          <CategoryChart data={ordered} topCategory={topCategory} />
          <CategoryProgress
            data={ordered}
            totalExpense={totalExpense}
            topCategory={topCategory}
          />
        </>
      )}
    </section>
  );
}
