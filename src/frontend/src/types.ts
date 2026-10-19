import type { Category, Transaction, TransactionKind } from "@/backend";

export type { Category, Transaction, TransactionKind };

export type CategoryKey = Category;

export interface CategoryTotal {
  category: Category;
  total: bigint;
}

export interface Summary {
  balance: bigint;
  totalIncome: bigint;
  totalExpense: bigint;
  byCategory: CategoryTotal[];
}

export interface NewTransactionInput {
  kind: TransactionKind;
  amount: bigint;
  category: Category;
  date: bigint;
}
