import { TransactionKind } from "@/backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getCategoryMeta } from "@/lib/categories";
import { formatDate, formatSignedCurrency } from "@/lib/format";
import type { Transaction } from "@/types";
import { Trash2 } from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
  index: number;
  onDelete: (id: bigint) => void;
  isDeleting: boolean;
}

export function TransactionItem({
  transaction,
  index,
  onDelete,
  isDeleting,
}: TransactionItemProps) {
  const meta = getCategoryMeta(transaction.category);
  const Icon = meta.icon;
  const isIncome = transaction.kind === TransactionKind.income;
  const position = index + 1;

  return (
    <li
      data-ocid={`summary.transaction_item.${position}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-smooth hover:border-primary/40"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bgClass} ${meta.textClass}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {meta.label}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={`font-medium ${isIncome ? "text-accent" : "text-destructive"}`}
          >
            {isIncome ? "Ingreso" : "Gasto"}
          </span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{formatDate(transaction.date)}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <span
          className={`tabular font-display text-sm font-semibold ${
            isIncome ? "text-accent" : "text-destructive"
          }`}
        >
          {formatSignedCurrency(
            transaction.amount,
            isIncome ? "income" : "expense",
          )}
        </span>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              data-ocid={`summary.delete_button.${position}`}
              aria-label={`Eliminar ${isIncome ? "ingreso" : "gasto"} de ${meta.label}`}
              disabled={isDeleting}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-smooth hover:bg-destructive/15 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid={`summary.delete_dialog.${position}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar transacción?</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminará el {isIncome ? "ingreso" : "gasto"} de {meta.label}{" "}
                por{" "}
                {formatSignedCurrency(
                  transaction.amount,
                  isIncome ? "income" : "expense",
                )}
                . Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                data-ocid={`summary.cancel_button.${position}`}
                className="rounded-full"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                data-ocid={`summary.confirm_button.${position}`}
                onClick={() => onDelete(transaction.id)}
                className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
