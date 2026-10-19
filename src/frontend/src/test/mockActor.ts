import { Category, TransactionKind } from "@/backend";
import type { Summary, Transaction } from "@/types";

/**
 * A typed in-memory stand-in for the backend actor. It implements the same
 * public methods the app's hooks call, so component tests exercise real
 * rendering, validation, and query/mutation wiring without a canister.
 *
 * This is a mock: it proves nothing about the real backend. The PocketIC lane
 * under `app/test/pocketic/` is what exercises the compiled canister.
 */
export interface MockActor {
  listTransactions(): Promise<Transaction[]>;
  getSummary(): Promise<Summary>;
  createTransaction(
    kind: TransactionKind,
    amount: bigint,
    category: Category,
    date: bigint,
  ): Promise<Transaction>;
  deleteTransaction(id: bigint): Promise<boolean>;
}

export interface MockActorState {
  transactions: Transaction[];
  nextId: bigint;
}

export function createMockActor(initial: Transaction[] = []): {
  actor: MockActor;
  state: MockActorState;
} {
  const state: MockActorState = {
    transactions: [...initial],
    nextId: initial.reduce((max, t) => (t.id >= max ? t.id + 1n : max), 1n),
  };

  const actor: MockActor = {
    async listTransactions() {
      return [...state.transactions].sort((a, b) => Number(b.date - a.date));
    },
    async getSummary() {
      let totalIncome = 0n;
      let totalExpense = 0n;
      const byCategory = new Map<Category, bigint>();
      for (const t of state.transactions) {
        if (t.kind === TransactionKind.income) {
          totalIncome += t.amount;
        } else {
          totalExpense += t.amount;
          byCategory.set(
            t.category,
            (byCategory.get(t.category) ?? 0n) + t.amount,
          );
        }
      }
      return {
        balance: totalIncome - totalExpense,
        totalIncome,
        totalExpense,
        byCategory: [...byCategory.entries()].map(([category, total]) => ({
          category,
          total,
        })),
      };
    },
    async createTransaction(kind, amount, category, date) {
      const transaction: Transaction = {
        id: state.nextId,
        kind,
        amount,
        category,
        date,
        createdAt: date,
      };
      state.nextId += 1n;
      state.transactions.push(transaction);
      return transaction;
    },
    async deleteTransaction(id) {
      const index = state.transactions.findIndex((t) => t.id === id);
      if (index === -1) return false;
      state.transactions.splice(index, 1);
      return true;
    },
  };

  return { actor, state };
}

/** Build a transaction fixture with sensible defaults. */
export function makeTransaction(
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    id: 1n,
    kind: TransactionKind.expense,
    amount: 10n,
    category: Category.comida,
    date: 1_000_000_000n,
    createdAt: 1_000_000_000n,
    ...overrides,
  };
}
