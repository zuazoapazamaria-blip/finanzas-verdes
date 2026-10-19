import { TransactionKind } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTransaction } from "@/hooks/useTransactions";
import { CATEGORIES } from "@/lib/categories";
import {
  dateToInputValue,
  dateToTimestamp,
  inputValueToDate,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, NewTransactionInput } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";

interface FormErrors {
  kind?: string;
  amount?: string;
  category?: string;
  date?: string;
}

const KIND_OPTIONS: {
  value: TransactionKind;
  label: string;
  hint: string;
  icon: typeof ArrowUpRight;
}[] = [
  {
    value: TransactionKind.expense,
    label: "Gasto",
    hint: "Dinero que sale",
    icon: ArrowUpRight,
  },
  {
    value: TransactionKind.income,
    label: "Ingreso",
    hint: "Dinero que entra",
    icon: ArrowDownLeft,
  },
];

export function TransactionForm() {
  const createTransaction = useCreateTransaction();

  const [kind, setKind] = useState<TransactionKind | null>(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [dateValue, setDateValue] = useState(() =>
    dateToInputValue(new Date()),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!kind) next.kind = "Selecciona el tipo de movimiento.";
    const parsed = Number.parseFloat(amount.replace(",", "."));
    if (!amount.trim()) {
      next.amount = "Introduce un monto.";
    } else if (Number.isNaN(parsed) || parsed <= 0) {
      next.amount = "El monto debe ser mayor que cero.";
    }
    if (!category) next.category = "Selecciona una categoría.";
    if (!dateValue) next.date = "Selecciona una fecha.";
    return next;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSaved(false);
      return;
    }

    const parsed = Number.parseFloat(amount.replace(",", "."));
    const input: NewTransactionInput = {
      kind: kind as TransactionKind,
      amount: BigInt(Math.round(parsed)),
      category: category as Category,
      date: dateToTimestamp(inputValueToDate(dateValue)),
    };

    // Clear the draft synchronously so the next entry starts fresh.
    setKind(null);
    setAmount("");
    setCategory(null);
    setDateValue(dateToInputValue(new Date()));
    setSaved(false);

    createTransaction.mutate(input, {
      onSuccess: () => setSaved(true),
    });
  }

  const isPending = createTransaction.isPending;

  return (
    <form
      data-ocid="transaction.form"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Tipo */}
      <fieldset data-ocid="transaction.kind_fieldset" className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Tipo</legend>
        <div className="grid grid-cols-2 gap-3">
          {KIND_OPTIONS.map((option) => {
            const Icon = option.icon;
            const active = kind === option.value;
            return (
              <button
                key={option.value}
                type="button"
                data-ocid={`transaction.kind.${option.value}`}
                aria-pressed={active}
                onClick={() => {
                  setKind(option.value);
                  setErrors((prev) => ({ ...prev, kind: undefined }));
                  setSaved(false);
                }}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-display text-sm font-semibold text-foreground">
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.hint}
                </span>
              </button>
            );
          })}
        </div>
        {errors.kind ? (
          <p
            data-ocid="transaction.kind.error"
            className="text-xs font-medium text-destructive"
          >
            {errors.kind}
          </p>
        ) : null}
      </fieldset>

      {/* Monto */}
      <div className="space-y-2">
        <Label htmlFor="transaction-amount">Monto</Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-display text-base text-muted-foreground">
            €
          </span>
          <Input
            id="transaction-amount"
            data-ocid="transaction.amount_input"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            value={amount}
            aria-invalid={Boolean(errors.amount)}
            onChange={(event) => {
              setAmount(event.target.value);
              setErrors((prev) => ({ ...prev, amount: undefined }));
              setSaved(false);
            }}
            className="h-12 pl-8 font-display text-lg tabular"
          />
        </div>
        {errors.amount ? (
          <p
            data-ocid="transaction.amount.error"
            className="text-xs font-medium text-destructive"
          >
            {errors.amount}
          </p>
        ) : null}
      </div>

      {/* Categoría */}
      <fieldset data-ocid="transaction.category_fieldset" className="space-y-2">
        <legend className="text-sm font-medium text-foreground">
          Categoría
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((meta) => {
            const Icon = meta.icon;
            const active = category === meta.key;
            return (
              <button
                key={meta.key}
                type="button"
                data-ocid={`transaction.category.${meta.key}`}
                aria-pressed={active}
                onClick={() => {
                  setCategory(meta.key);
                  setErrors((prev) => ({ ...prev, category: undefined }));
                  setSaved(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/40 hover:bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    meta.bgClass,
                    meta.textClass,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-center text-xs font-medium leading-tight text-foreground">
                  {meta.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.category ? (
          <p
            data-ocid="transaction.category.error"
            className="text-xs font-medium text-destructive"
          >
            {errors.category}
          </p>
        ) : null}
      </fieldset>

      {/* Fecha */}
      <div className="space-y-2">
        <Label htmlFor="transaction-date">Fecha</Label>
        <Input
          id="transaction-date"
          data-ocid="transaction.date_input"
          type="date"
          value={dateValue}
          aria-invalid={Boolean(errors.date)}
          onChange={(event) => {
            setDateValue(event.target.value);
            setErrors((prev) => ({ ...prev, date: undefined }));
            setSaved(false);
          }}
          className="h-12"
        />
        {errors.date ? (
          <p
            data-ocid="transaction.date.error"
            className="text-xs font-medium text-destructive"
          >
            {errors.date}
          </p>
        ) : null}
      </div>

      {createTransaction.isError ? (
        <p
          data-ocid="transaction.error_state"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          No se pudo guardar el movimiento. Inténtalo de nuevo.
        </p>
      ) : null}

      {saved ? (
        <p
          data-ocid="transaction.success_state"
          className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
        >
          <Check className="h-4 w-4" />
          Movimiento guardado correctamente.
        </p>
      ) : null}

      <Button
        type="submit"
        data-ocid="transaction.submit_button"
        disabled={isPending}
        className="h-12 w-full rounded-xl font-display text-base font-semibold"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Guardando…
          </>
        ) : (
          "Guardar movimiento"
        )}
      </Button>
    </form>
  );
}
