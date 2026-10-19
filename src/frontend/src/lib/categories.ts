import { Category } from "@/backend";
import {
  Bus,
  Clapperboard,
  type LucideIcon,
  UtensilsCrossed,
} from "lucide-react";

export interface CategoryMeta {
  key: Category;
  label: string;
  icon: LucideIcon;
  /** Tailwind text color class for the category accent. */
  textClass: string;
  /** Tailwind background class for chips and icon wells. */
  bgClass: string;
  /** CSS custom-property reference used for chart fills and progress bars. */
  chartVar: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: Category.comida,
    label: "Comida",
    icon: UtensilsCrossed,
    textClass: "text-chart-1",
    bgClass: "bg-chart-1/15",
    chartVar: "var(--chart-1)",
  },
  {
    key: Category.transporte,
    label: "Transporte",
    icon: Bus,
    textClass: "text-chart-2",
    bgClass: "bg-chart-2/15",
    chartVar: "var(--chart-2)",
  },
  {
    key: Category.entretenimiento,
    label: "Entretenimiento",
    icon: Clapperboard,
    textClass: "text-chart-3",
    bgClass: "bg-chart-3/15",
    chartVar: "var(--chart-3)",
  },
];

const CATEGORY_BY_KEY: Record<Category, CategoryMeta> = {
  [Category.comida]: CATEGORIES[0],
  [Category.transporte]: CATEGORIES[1],
  [Category.entretenimiento]: CATEGORIES[2],
};

export function getCategoryMeta(category: Category): CategoryMeta {
  return CATEGORY_BY_KEY[category] ?? CATEGORIES[0];
}
