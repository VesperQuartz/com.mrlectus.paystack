/**
 * Public type surface for the API clients.
 *
 * `PaystackClient` is exported, but the types it is composed of live in each
 * module's `types.ts` and were never reachable from the entry point: a
 * consumer could obtain a client yet not name a single one of its members,
 * their request/response payloads, or the resources they return. That makes
 * the client unusable from a declaration file, because bundlers have to emit
 * named references (e.g. `CreateRefundsClient`) that do not exist publicly.
 *
 * Re-exporting each module's types makes the whole client shape nameable
 * downstream. It is type-only, so nothing is added to the runtime bundle.
 *
 * `Customer` and `Subaccount` are each declared by more than one module — the
 * API resource plus a nested shape embedded in another response. `export *`
 * treats a name exported by several modules as ambiguous and silently drops
 * it, so both are also exported explicitly from the canonical resource. The
 * nested variants stay internal; they are subsets of the resource, not
 * distinct public entities.
 */
export * from "./apple-pay/types";
export * from "./bulk-charges/types";
export * from "./charges/types";
export type { Customer } from "./customers/types";
export * from "./customers/types";
export * from "./dedicated-virtual-accounts/types";
export * from "./direct-debit/types";
export * from "./disputes/types";
export * from "./errors";
export * from "./integration/types";
export * from "./miscellaneous/types";
export * from "./payment-page/types";
export * from "./payment-requests/types";
export * from "./paystack/index";
export * from "./plans/types";
export * from "./products/types";
export * from "./refunds/types";
export * from "./schemas";
export * from "./settlements/types";
export type { Subaccount } from "./subaccounts/types";
export * from "./subaccounts/types";
export * from "./subscriptions/types";
export * from "./terminal/types";
export * from "./transaction-splits/types";
export * from "./transactions/types";
export * from "./transfers/types";
export * from "./transfers-control/types";
export * from "./transfers-recipients/types";
export * from "./types";
export * from "./verification/types";
export * from "./virtual-terminal/types";
export * from "./webhook/schema";
export * from "./webhook/types";
