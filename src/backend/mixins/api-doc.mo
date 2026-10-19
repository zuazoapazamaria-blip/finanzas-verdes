mixin () {
  public query func getApiDoc() : async Text {
    "# Finance Tracker Backend API

## Purpose

Backend for a mobile-first personal finance tracker. It stores income and
expense transactions with a fixed category set (Comida, Transporte,
Entretenimiento), and computes a running balance plus a per-category expense
breakdown used by the frontend chart.

## Authentication and identity

All endpoints are callable by any principal, including anonymous callers. The
app's frontend authenticates with Internet Identity and pins a derivation
origin, published at `/.well-known/ii-derivation-origin` when available. An
agent that already holds the user's Internet Identity authorization derives the
correct per-app principal against that origin (for example
`icp identity link web <name> --app <host>`). Such a delegation acts with the
user's full authority in this app until it expires.

## Authorization

There is no per-user data isolation in this backend: transactions are stored in
a single shared map and every caller reads and writes the same data. The
`caller` principal is accepted by the mutation and read endpoints but is not
used to scope rows. The authorization component is installed
(`_initialize_access_control` and the role-management endpoints are available),
but the transaction endpoints do not require a role.

## Units and encoding

- `amount` is a `Nat` in whole currency units (no decimals, no cents).
- `date` and `createdAt` are `Nat` timestamps in nanoseconds since the Unix
  epoch. `date` is supplied by the caller; `createdAt` is set by the backend
  from the canister clock at creation time.
- `kind` is the variant `#income` or `#expense`.
- `category` is the variant `#comida`, `#transporte`, or `#entretenimiento`.
- `balance` in the summary is an `Int` and may be negative.
- `id` is a `Nat` assigned by the backend, monotonically increasing from 0.

## Methods

- `createTransaction(kind, amount, category, date) : async Transaction` —
  update call. Persists a new transaction and returns it, including the
  backend-assigned `id` and `createdAt`.
- `listTransactions() : async [Transaction]` — query call. Returns all
  transactions sorted by `date` descending, ties broken by `id` descending.
- `deleteTransaction(id) : async Bool` — update call. Removes the transaction
  with the given `id`; returns `true` if it existed, `false` otherwise.
- `getSummary() : async Summary` — query call. Returns `totalIncome`,
  `totalExpense`, `balance` (`totalIncome - totalExpense`), and `byCategory`,
  the expense total for each of the three fixed categories.
- `getApiDoc() : async Text` — query call. Returns this document.

## Lifecycle and polling

`createTransaction` and `deleteTransaction` are update calls and take effect
only after the call completes. `listTransactions` and `getSummary` are query
calls and read the latest committed state. After a mutation, re-fetch
`listTransactions` and `getSummary` to observe the new balance and category
breakdown.

## Mutation retry safety

`createTransaction` is not idempotent: each successful call appends a new
transaction with a fresh `id`, so retrying a call that already succeeded
creates a duplicate. `deleteTransaction` is idempotent in effect: deleting an
already-deleted `id` returns `false` and changes nothing.

## Errors and gotchas

- `amount` is a `Nat`; negative values cannot be represented. Record an
  expense with `kind = #expense` and a positive `amount`.
- `date` is caller-supplied and is not validated against the current time.
- There is no update or edit endpoint; a transaction can only be created or
  deleted.
- The summary's `byCategory` always contains all three categories, including
  zero totals.
";
  };
};
