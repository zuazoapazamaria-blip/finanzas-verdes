import { getCategoryMeta } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryTotal } from "@/types";
import { Crown } from "lucide-react";

interface CategoryProgressProps {
  data: CategoryTotal[];
  totalExpense: bigint;
  topCategory: CategoryTotal | null;
}

export function CategoryProgress({
  data,
  totalExpense,
  topCategory,
}: CategoryProgressProps) {
  const total = Number(totalExpense);

  return (
    <div
      data-ocid="analisis.progress"
      className="rounded-2xl border border-border bg-card p-4 shadow-subtle"
    >
      <h2 className="mb-4 font-display text-sm font-semibold tracking-tight text-foreground">
        Proporción del gasto
      </h2>

      <ul className="space-y-4">
        {data.map((entry, index) => {
          const meta = getCategoryMeta(entry.category);
          const Icon = meta.icon;
          const amount = Number(entry.total);
          const share = total > 0 ? Math.round((amount / total) * 100) : 0;
          const isTop = topCategory?.category === entry.category;

          return (
            <li
              key={entry.category}
              data-ocid={`analisis.progress.item.${index + 1}`}
              className={`rounded-xl border p-3 transition-smooth ${
                isTop
                  ? "border-accent/50 bg-accent/5"
                  : "border-transparent bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.bgClass} ${meta.textClass}`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {meta.label}
                    </span>
                    {isTop ? (
                      <span
                        data-ocid={`analisis.top_badge.${index + 1}`}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent"
                      >
                        <Crown className="h-3 w-3" aria-hidden="true" />
                        Mayor gasto
                      </span>
                    ) : null}
                  </div>
                  <p className="tabular mt-0.5 text-xs text-muted-foreground">
                    {formatCurrency(entry.total)} · {share}%
                  </p>
                </div>
              </div>

              <div
                className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                tabIndex={0}
                aria-label={`Proporción de ${meta.label}`}
                aria-valuenow={share}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full transition-smooth"
                  style={{
                    width: `${share}%`,
                    backgroundColor: meta.chartVar,
                    opacity: isTop ? 1 : 0.6,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
