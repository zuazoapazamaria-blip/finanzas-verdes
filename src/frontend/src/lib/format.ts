const currencyFormatter = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const monthFormatter = new Intl.DateTimeFormat("es-ES", {
  month: "long",
  year: "numeric",
});

/** Convert a Motoko nanosecond timestamp into a JS Date, or null when invalid. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Format a bigint amount (in whole currency units) as Spanish currency. */
export function formatCurrency(amount: bigint): string {
  return currencyFormatter.format(Number(amount));
}

/** Format a bigint amount with an explicit sign glyph for ledger rows. */
export function formatSignedCurrency(
  amount: bigint,
  kind: "income" | "expense",
): string {
  const sign = kind === "income" ? "+" : "−";
  return `${sign}${currencyFormatter.format(Number(amount < 0n ? -amount : amount))}`;
}

/** Format a backend timestamp as a short Spanish date, with a safe fallback. */
export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? dateFormatter.format(date) : "Fecha desconocida";
}

/** Format a backend timestamp as a Spanish month + year label. */
export function formatMonthLabel(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  const label = date
    ? monthFormatter.format(date)
    : monthFormatter.format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Convert a JS Date to the nanosecond timestamp the backend expects. */
export function dateToTimestamp(date: Date): bigint {
  return BigInt(date.getTime()) * 1_000_000n;
}

/** Convert a Date to the yyyy-mm-dd value used by native date inputs. */
export function dateToInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parse a yyyy-mm-dd input value into a Date, defaulting to today. */
export function inputValueToDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
}
