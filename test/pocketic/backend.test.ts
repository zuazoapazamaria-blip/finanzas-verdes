import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BACKEND_WASM }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({ idlFactory, wasm: BASELINE_WASM });
  await pic.upgradeCanister({ canisterId: installed.canisterId, wasm: BACKEND_WASM, arg: new Uint8Array() });
  ({ actor, canisterId } = installed);
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("answers an empty-state read instead of trapping", async () => {
  await expect(actor.listTransactions()).resolves.toEqual([]);
  const summary = await actor.getSummary();
  expect(summary.balance).toBe(0n);
  expect(summary.totalIncome).toBe(0n);
  expect(summary.totalExpense).toBe(0n);
});

it("round-trips a transaction through the real canister", async () => {
  const created = await actor.createTransaction({ expense: null }, 50n, { comida: null }, 1_000_000_000n);
  expect(created.amount).toBe(50n);
  expect(created.category).toEqual({ comida: null });
  expect(created.kind).toEqual({ expense: null });

  const rows = await actor.listTransactions();
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ id: created.id, amount: 50n });
});

it("computes balance and per-category spend from real state", async () => {
  await actor.createTransaction({ income: null }, 200n, { comida: null }, 2_000_000_000n);
  await actor.createTransaction({ expense: null }, 30n, { transporte: null }, 3_000_000_000n);

  const summary = await actor.getSummary();
  expect(summary.totalIncome).toBe(200n);
  expect(summary.totalExpense).toBe(80n);
  expect(summary.balance).toBe(120n);

  const comida = summary.byCategory.find((entry) => "comida" in entry.category);
  const transporte = summary.byCategory.find((entry) => "transporte" in entry.category);
  expect(comida?.total).toBe(50n);
  expect(transporte?.total).toBe(30n);
});

it("deletes a transaction and recalculates the summary", async () => {
  const created = await actor.createTransaction({ expense: null }, 25n, { entretenimiento: null }, 4_000_000_000n);
  const before = await actor.getSummary();
  expect(before.totalExpense).toBe(105n);

  await expect(actor.deleteTransaction(created.id)).resolves.toBe(true);

  const after = await actor.getSummary();
  expect(after.totalExpense).toBe(80n);
  const rows = await actor.listTransactions();
  expect(rows.some((row) => row.id === created.id)).toBe(false);
});

it("returns false when deleting an unknown transaction", async () => {
  await expect(actor.deleteTransaction(999_999n)).resolves.toBe(false);
});
