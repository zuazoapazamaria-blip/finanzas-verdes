import { TransactionForm } from "@/components/TransactionForm";
import { Card } from "@/components/ui/card";

export function RegistroPage() {
  return (
    <section data-ocid="page.registro" className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Registro
        </h1>
        <p className="text-sm text-muted-foreground">
          Registra tus ingresos y gastos para mantener tu cartera al día.
        </p>
      </header>

      <Card
        data-ocid="transaction.card"
        className="rounded-2xl border-border bg-card p-5 shadow-none"
      >
        <TransactionForm />
      </Card>
    </section>
  );
}
