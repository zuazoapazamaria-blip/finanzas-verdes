import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { Category, TransactionKind } from "@/backend";
import {
  type MockActor,
  createMockActor,
  makeTransaction,
} from "@/test/mockActor";
import type { Transaction } from "@/types";

// The app's hooks resolve their actor through `useActor` from
// `@caffeineai/core-infrastructure`. Replacing that one seam with a typed local
// actor keeps every component, hook, and query real while removing the canister.
const actorRef: { current: MockActor } = { current: createMockActor().actor };

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: () => ({ actor: actorRef.current, isFetching: false }),
}));

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  actorRef.current = createMockActor().actor;
});

describe("Resumen", () => {
  it("renders the empty state and a zero balance on first load", async () => {
    renderApp();

    expect(await screen.findByTestId("page.resumen")).toBeInTheDocument();
    expect(
      await screen.findByText("Aún no hay movimientos"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("summary.balance_value")).toHaveTextContent(
      "0,00",
    );
  });

  it("shows balance, income, and expense totals from the summary", async () => {
    actorRef.current = createMockActor([
      makeTransaction({
        id: 1n,
        kind: TransactionKind.income,
        amount: 200n,
        date: 2n,
      }),
      makeTransaction({
        id: 2n,
        kind: TransactionKind.expense,
        amount: 50n,
        category: Category.comida,
        date: 1n,
      }),
    ]).actor;

    renderApp();

    await waitFor(() =>
      expect(screen.getByTestId("summary.balance_value")).toHaveTextContent(
        "150,00",
      ),
    );
    expect(screen.getByTestId("summary.income_total")).toHaveTextContent(
      "200,00",
    );
    expect(screen.getByTestId("summary.expense_total")).toHaveTextContent(
      "50,00",
    );
  });

  it("lists transactions newest first with category, kind, and amount", async () => {
    actorRef.current = createMockActor([
      makeTransaction({
        id: 1n,
        kind: TransactionKind.expense,
        amount: 50n,
        category: Category.comida,
        date: 1_000n,
      }),
      makeTransaction({
        id: 2n,
        kind: TransactionKind.income,
        amount: 200n,
        category: Category.transporte,
        date: 5_000n,
      }),
    ]).actor;

    renderApp();

    const list = await screen.findByTestId("summary.transactions_list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    // Newest (date 5000) first.
    expect(items[0]).toHaveTextContent("Transporte");
    expect(items[0]).toHaveTextContent("Ingreso");
    expect(items[0]).toHaveTextContent("+200,00");
    expect(items[1]).toHaveTextContent("Comida");
    expect(items[1]).toHaveTextContent("Gasto");
    expect(items[1]).toHaveTextContent("−50,00");
  });

  it("deletes a transaction after confirmation and recalculates the balance", async () => {
    const user = userEvent.setup();
    actorRef.current = createMockActor([
      makeTransaction({
        id: 1n,
        kind: TransactionKind.income,
        amount: 200n,
        date: 2n,
      }),
      makeTransaction({
        id: 2n,
        kind: TransactionKind.expense,
        amount: 50n,
        category: Category.comida,
        date: 1n,
      }),
    ]).actor;

    renderApp();

    await waitFor(() =>
      expect(screen.getByTestId("summary.balance_value")).toHaveTextContent(
        "150,00",
      ),
    );

    await user.click(await screen.findByTestId("summary.delete_button.2"));
    // The confirmation dialog must appear before anything is deleted.
    expect(
      await screen.findByText("¿Eliminar transacción?"),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId("summary.confirm_button.2"));

    await waitFor(() =>
      expect(screen.getByTestId("summary.balance_value")).toHaveTextContent(
        "200,00",
      ),
    );
    expect(screen.getByTestId("summary.expense_total")).toHaveTextContent(
      "0,00",
    );
  });

  it("keeps the transaction when the delete confirmation is cancelled", async () => {
    const user = userEvent.setup();
    actorRef.current = createMockActor([
      makeTransaction({
        id: 1n,
        kind: TransactionKind.expense,
        amount: 50n,
        category: Category.comida,
        date: 1n,
      }),
    ]).actor;

    renderApp();

    await user.click(await screen.findByTestId("summary.delete_button.1"));
    await user.click(await screen.findByTestId("summary.cancel_button.1"));

    await waitFor(() =>
      expect(screen.getByTestId("summary.expense_total")).toHaveTextContent(
        "50,00",
      ),
    );
    expect(screen.getByTestId("summary.transactions_list")).toBeInTheDocument();
  });
});

describe("Registro", () => {
  it("blocks submission and reports every missing required field", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByTestId("nav.registro"));
    await user.click(await screen.findByTestId("transaction.submit_button"));

    expect(
      await screen.findByTestId("transaction.kind.error"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("transaction.amount.error")).toBeInTheDocument();
    expect(
      screen.getByTestId("transaction.category.error"),
    ).toBeInTheDocument();
    expect(actorRef.current).toBeDefined();
  });

  it("rejects a non-positive amount", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByTestId("nav.registro"));
    await user.type(await screen.findByTestId("transaction.amount_input"), "0");
    await user.click(screen.getByTestId("transaction.submit_button"));

    expect(
      await screen.findByTestId("transaction.amount.error"),
    ).toHaveTextContent("mayor que cero");
  });

  it("saves a transaction, confirms visually, and clears the form", async () => {
    const user = userEvent.setup();
    const created: Transaction[] = [];
    const base = createMockActor();
    actorRef.current = {
      ...base.actor,
      async createTransaction(kind, amount, category, date) {
        const t = await base.actor.createTransaction(
          kind,
          amount,
          category,
          date,
        );
        created.push(t);
        return t;
      },
    };

    renderApp();
    await user.click(await screen.findByTestId("nav.registro"));

    await user.click(await screen.findByTestId("transaction.kind.expense"));
    await user.type(
      await screen.findByTestId("transaction.amount_input"),
      "50",
    );
    await user.click(await screen.findByTestId("transaction.category.comida"));
    await user.click(screen.getByTestId("transaction.submit_button"));

    expect(
      await screen.findByTestId("transaction.success_state"),
    ).toHaveTextContent("guardado correctamente");
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({
      kind: TransactionKind.expense,
      amount: 50n,
      category: Category.comida,
    });
    // The draft is cleared for the next entry.
    expect(screen.getByTestId("transaction.amount_input")).toHaveValue("");
    expect(screen.getByTestId("transaction.kind.expense")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});

describe("Analisis", () => {
  it("shows a clear empty state when there are no expenses", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByTestId("nav.analisis"));

    expect(
      await screen.findByTestId("analisis.empty_state"),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("analisis.chart")).not.toBeInTheDocument();
  });

  it("renders per-category spend and highlights the top category", async () => {
    const user = userEvent.setup();
    actorRef.current = createMockActor([
      makeTransaction({
        id: 1n,
        kind: TransactionKind.expense,
        amount: 50n,
        category: Category.comida,
        date: 1n,
      }),
      makeTransaction({
        id: 2n,
        kind: TransactionKind.expense,
        amount: 30n,
        category: Category.transporte,
        date: 2n,
      }),
    ]).actor;

    renderApp();
    await user.click(await screen.findByTestId("nav.analisis"));

    expect(await screen.findByTestId("analisis.chart")).toBeInTheDocument();
    const progress = await screen.findByTestId("analisis.progress");
    expect(progress).toHaveTextContent("Comida");
    expect(progress).toHaveTextContent("50,00");
    expect(progress).toHaveTextContent("Transporte");
    expect(progress).toHaveTextContent("30,00");

    // Comida is the largest expense, so it carries the top badge.
    expect(screen.getByTestId("analisis.top_badge.1")).toHaveTextContent(
      "Mayor gasto",
    );
    expect(
      screen.queryByTestId("analisis.top_badge.2"),
    ).not.toBeInTheDocument();
  });
});

describe("navigation", () => {
  it("moves between the three sections from the bottom bar", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(await screen.findByTestId("nav.registro"));
    expect(await screen.findByTestId("page.registro")).toBeInTheDocument();

    await user.click(screen.getByTestId("nav.analisis"));
    expect(await screen.findByTestId("page.analisis")).toBeInTheDocument();

    await user.click(screen.getByTestId("nav.summary"));
    expect(await screen.findByTestId("page.resumen")).toBeInTheDocument();
  });
});
