import type { Authorization, Customer, PaymentChannel } from "#/transactions";
import type { Currency, MetaV1 } from "#/types";

export type InitiateBulkChargePayload = {
  authorization: string;
  amount: number;
  reference: string;
}[];

type BulkCharge = {
  batch_code: `BCH_${string}`;
  reference: string;
  id: number;
  integration: number;
  domain: string;
  status: "active" | (string & {});
  total_charges: number;
  pending_charges: number;
  createdAt: string;
  updatedAt: string;
};

export type InitiateBulkChargeResponsePayload = {
  status: boolean;
  message: string;
  data: BulkCharge;
};

export type ListBulkChargeBatchesPayload = {
  /**
   * Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
   */
  perPage?: number;
  /**
   * Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
   */
  page?: number;
  /**
   * A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  from?: string | Date;
  /**
   * A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  to?: string | Date;
};

export type ListBulkChargeBatchesResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    Pick<
      BulkCharge,
      | "domain"
      | "batch_code"
      | "status"
      | "id"
      | "total_charges"
      | "pending_charges"
      | "createdAt"
      | "updatedAt"
    >
  >[];
  meta: MetaV1;
};

export type FetchBulkChargeBatchResponsePayload = {
  status: boolean;
  message: string;
  data: Omit<BulkCharge, "integration" | "reference">;
};

export type FetchChargesBatchPayload = ListBulkChargeBatchesPayload & {
  id_or_code: string;
  status: "pending" | "success" | "failed";
};

export type Transaction = {
  id: number;
  domain: string;
  status: "pending" | "success" | "failed";
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: PaymentChannel;
  currency: Currency;
  ip_address: string | null;
  metadata: string;
  log: string | null;
  fees: string | null;
  fees_split: string | null;
  customer: object;
  authorization: object;
  plan: object;
  subaccount: object;
  paidAt: string;
  createdAt: string;
};

export type FetchChargesBatchResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    {
      integration: number;
      bulkcharge: number;
      customer: Customer;
      authorization: Authorization;
      transaction: Transaction;
    }[]
  >;
};

export type CreateBulkChargeClient = {
  /**
   * Send an array of objects with authorization codes and amount, using the supported currency format, so we can process transactions as a batch.
   */
  initiate: (
    payload: InitiateBulkChargePayload,
  ) => Promise<InitiateBulkChargeResponsePayload>;
  /**
   * This lists all bulk charge batches created by the integration. Statuses can be `active`, `paused`, or `complete`
   */
  listBatches: (
    payload: ListBulkChargeBatchesPayload,
  ) => Promise<ListBulkChargeBatchesResponsePayload>;
  /**
   * This endpoint retrieves a specific batch code. It also returns useful information on its progress by way of the `total_charges` and `pending_charges` attributes.
   */
  fetch: (payload: {
    /** An ID or code for the batch whose details you want to retrieve. */
    id_or_code: string;
  }) => Promise<FetchBulkChargeBatchResponsePayload>;
  /**
   * This endpoint retrieves the charges associated with a specified batch code. Pagination parameters are available. You can also filter by status. Charge statuses can be `pending`, `success` or `failed`.
   */
  fetchBatch: (
    payload: FetchChargesBatchPayload,
  ) => Promise<FetchChargesBatchResponsePayload>;
  /**
   * Use this endpoint to pause processing a batch
   */
  pauseBatch: (payload: {
    /** The batch code for the bulk charge you want to pause. */
    batch_code: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
  /**
   * Use this endpoint to resume processing a batch
   */
  resumeBatch: (payload: {
    /** The batch code for the bulk charge you want to resume. */
    batch_code: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
};
