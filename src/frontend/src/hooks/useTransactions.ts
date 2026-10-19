import { createActor } from "@/backend";
import type { NewTransactionInput, Summary, Transaction } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TRANSACTIONS_KEY = ["transactions"] as const;
export const SUMMARY_KEY = ["summary"] as const;

/** List every transaction, newest first. */
export function useTransactions() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Transaction[]>({
    queryKey: TRANSACTIONS_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const rows = await actor.listTransactions();
      return [...rows].sort((a, b) => Number(b.date - a.date));
    },
    enabled: !!actor && !isFetching,
  });
}

/** Aggregate totals and per-category spend. */
export function useSummary() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Summary>({
    queryKey: SUMMARY_KEY,
    queryFn: async () => {
      if (!actor) {
        return {
          balance: 0n,
          totalIncome: 0n,
          totalExpense: 0n,
          byCategory: [],
        };
      }
      return actor.getSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Register a new transaction and refresh the ledger and summary. */
export function useCreateTransaction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewTransactionInput) => {
      if (!actor) throw new Error("El backend no está disponible");
      return actor.createTransaction(
        input.kind,
        input.amount,
        input.category,
        input.date,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      void queryClient.invalidateQueries({ queryKey: SUMMARY_KEY });
    },
  });
}

/** Delete a transaction by id and refresh the ledger and summary. */
export function useDeleteTransaction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("El backend no está disponible");
      return actor.deleteTransaction(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY });
      void queryClient.invalidateQueries({ queryKey: SUMMARY_KEY });
    },
  });
}
