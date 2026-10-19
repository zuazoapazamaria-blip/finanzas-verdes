import { getCategoryMeta } from "@/lib/categories";
import { formatCurrency } from "@/lib/format";
import type { CategoryTotal } from "@/types";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CategoryChartProps {
  data: CategoryTotal[];
  topCategory: CategoryTotal | null;
}

interface ChartDatum {
  key: string;
  label: string;
  value: number;
  fill: string;
  isTop: boolean;
}

interface TooltipPayloadItem {
  payload: ChartDatum;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{datum.label}</p>
      <p className="tabular text-sm font-semibold text-accent">
        {formatCurrency(BigInt(Math.round(datum.value)))}
      </p>
    </div>
  );
}

export function CategoryChart({ data, topCategory }: CategoryChartProps) {
  const chartData: ChartDatum[] = data.map((entry) => {
    const meta = getCategoryMeta(entry.category);
    return {
      key: entry.category,
      label: meta.label,
      value: Number(entry.total),
      fill: meta.chartVar,
      isTop: topCategory?.category === entry.category,
    };
  });

  return (
    <div
      data-ocid="analisis.chart"
      className="rounded-2xl border border-border bg-card p-4 shadow-subtle"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="font-display text-sm font-semibold tracking-tight text-foreground">
          Gasto por categoría
        </h2>
        <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
          Total
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 4, bottom: 0, left: -18 }}
            barCategoryGap="28%"
          >
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={(value: number) => `${value} €`}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
              content={<ChartTooltip />}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
              {chartData.map((datum) => (
                <Cell
                  key={datum.key}
                  fill={datum.fill}
                  fillOpacity={datum.isTop ? 1 : 0.55}
                  stroke={datum.isTop ? "var(--accent)" : "transparent"}
                  strokeWidth={datum.isTop ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
