import { formatCurrency } from "@/lib/format";
import type { Summary } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

interface BalanceCardProps {
  summary: Summary | undefined;
  isLoading: boolean;
}

export function BalanceCard({ summary, isLoading }: BalanceCardProps) {
  const balance = summary?.balance ?? 0n;
  const totalIncome = summary?.totalIncome ?? 0n;
  const totalExpense = summary?.totalExpense ?? 0n;
  const isNegative = balance < 0n;

  return (
    <section
      data-ocid="summary.balance_card"
      aria-label="Saldo disponible"
      className="relative overflow-hidden rounded-3xl border border-border bg-gradient-balance p-5 shadow-card"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-2xl"
      />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Saldo disponible
          </span>
        </div>
        <span className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Total
        </span>
      </div>

      {isLoading ? (
        <div
          data-ocid="summary.balance_loading"
          className="mt-4 h-11 w-40 animate-pulse rounded-xl bg-muted"
        />
      ) : (
        <p
          data-ocid="summary.balance_value"
          className={`tabular mt-3 font-display text-4xl font-bold tracking-tight ${
            isNegative ? "text-destructive" : "text-foreground"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      )}

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div
          data-ocid="summary.income_total"
          className="rounded-2xl border border-border bg-card/70 p-3"
        >
          <div className="flex items-center gap-1.5 text-accent">
            <ArrowUpRight
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Ingresos
            </span>
          </div>
          {isLoading ? (
            <div className="mt-2 h-6 w-24 animate-pulse rounded-md bg-muted" />
          ) : (
            <p className="tabular mt-1.5 font-display text-lg font-semibold text-accent">
              {formatCurrency(totalIncome)}
            </p>
          )}
        </div>

        <div
          data-ocid="summary.expense_total"
          className="rounded-2xl border border-border bg-card/70 p-3"
        >
          <div className="flex items-center gap-1.5 text-destructive">
            <ArrowDownLeft
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Gastos
            </span>
          </div>
          {isLoading ? (
            <div className="mt-2 h-6 w-24 animate-pulse rounded-md bg-muted" />
          ) : (
            <p className="tabular mt-1.5 font-display text-lg font-semibold text-destructive">
              {formatCurrency(totalExpense)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
