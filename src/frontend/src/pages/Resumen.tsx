import { BalanceCard } from "@/components/BalanceCard";
import { TransactionList } from "@/components/TransactionList";
import {
  useDeleteTransaction,
  useSummary,
  useTransactions,
} from "@/hooks/useTransactions";
import { useState } from "react";

export function ResumenPage() {
  const summaryQuery = useSummary();
  const transactionsQuery = useTransactions();
  const deleteMutation = useDeleteTransaction();
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const handleDelete = (id: bigint) => {
    setDeletingId(id);
    deleteMutation.mutate(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  return (
    <section data-ocid="page.resumen" className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Resumen
        </h1>
        <p className="text-sm text-muted-foreground">
          Tu saldo disponible y tus movimientos más recientes.
        </p>
      </header>

      <BalanceCard
        summary={summaryQuery.data}
        isLoading={summaryQuery.isLoading}
      />

      <TransactionList
        transactions={transactionsQuery.data}
        isLoading={transactionsQuery.isLoading}
        isError={transactionsQuery.isError}
        onDelete={handleDelete}
        deletingId={deletingId}
      />
    </section>
  );
}
