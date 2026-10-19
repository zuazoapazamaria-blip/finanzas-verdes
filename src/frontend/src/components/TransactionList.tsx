import { TransactionItem } from "@/components/TransactionItem";
import type { Transaction } from "@/types";
import { Link } from "@tanstack/react-router";
import { PlusCircle, Receipt, TriangleAlert } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: bigint) => void;
  deletingId: bigint | null;
}

const SKELETON_IDS = Array.from(
  { length: 4 },
  (_, i) => `transaction-skeleton-${i}`,
);

export function TransactionList({
  transactions,
  isLoading,
  isError,
  onDelete,
  deletingId,
}: TransactionListProps) {
  return (
    <section data-ocid="summary.transactions_section" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
          Movimientos recientes
        </h2>
        {transactions && transactions.length > 0 ? (
          <span className="text-xs font-medium text-muted-foreground">
            {transactions.length}{" "}
            {transactions.length === 1 ? "registro" : "registros"}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <ul
          data-ocid="summary.transactions_loading"
          className="space-y-2"
          aria-hidden="true"
        >
          {SKELETON_IDS.map((id) => (
            <li
              key={id}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
            >
              <span className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <span className="block h-3.5 w-24 animate-pulse rounded bg-muted" />
                <span className="block h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
              <span className="h-4 w-16 animate-pulse rounded bg-muted" />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <div
          data-ocid="summary.transactions_error_state"
          className="flex flex-col items-center gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-8 text-center"
        >
          <TriangleAlert
            className="h-6 w-6 text-destructive"
            strokeWidth={2}
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-foreground">
            No se pudieron cargar los movimientos.
          </p>
          <p className="text-xs text-muted-foreground">
            Revisa tu conexión e inténtalo de nuevo.
          </p>
        </div>
      ) : !transactions || transactions.length === 0 ? (
        <div
          data-ocid="summary.transactions_empty_state"
          className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Receipt
              className="h-7 w-7"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </span>
          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-foreground">
              Aún no hay movimientos
            </p>
            <p className="text-sm text-muted-foreground">
              Registra tu primer ingreso o gasto para empezar a ver tu saldo.
            </p>
          </div>
          <Link
            to="/registro"
            data-ocid="summary.empty_state_button"
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <PlusCircle
              className="h-4 w-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            Registrar movimiento
          </Link>
        </div>
      ) : (
        <ul data-ocid="summary.transactions_list" className="space-y-2">
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id.toString()}
              transaction={transaction}
              index={index}
              onDelete={onDelete}
              isDeleting={deletingId === transaction.id}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
