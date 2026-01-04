import type {
  Details,
  ListTransferRecipientsResponsePayload,
} from "#/transfers-recipients";
import type { Currency } from "#/types";

export type InitiateTransferPayload = {
  /** Where should we transfer from? Only `balance` for now */
  source: "balance";
  /** Amount to transfer in *kobo* if currency is `NGN` and *pesewas* if currency is `GHS`. */
  amount: number;
  /** Code for transfer recipient */
  recipient: string;
  /** A unique identifier containing lowercase letters `(a-z)`, digits `(0-9)` and these symbols: dash `(-)`, underscore(_). */
  reference: string;
  /** The reason for the transfer. This would also show up in the narration of the customer's credit notification */
  reason?: string;
  /** Specify the currency of the transfer. Defaults to NGN */
  currency?: Currency;
  /** A unique identifier required in Kenya for MPESA Paybill and Till transfers */
  account_reference?: string;
};

type Transfer = {
  transfersessionid: unknown[];
  transfertrials: unknown[];
  domain: string;
  amount: number;
  currency: "NGN";
  reference: string;
  source: "balance";
  source_details: null;
  reason: string;
  status: "success" | (string & {});
  failures: string | null;
  transfer_code: `TRF_${string}`;
  titan_code: string | null;
  transferred_at: string | null;
  id: number;
  integration: number;
  request: number;
  recipient: number;
  createdAt: string;
  updatedAt: string;
};

export type InitiateTransferResponsePayload = {
  status: boolean;
  message: string;
  data: Transfer;
};

export type FinalizeTransferResponsePayload = {
  status: boolean;
  message: string;
  data: Omit<Transfer, "transfersessionid" | "transfertrials">;
};

export type InitiateBulkTransferPayload = {
  source: "balance";
  transfers: InitiateTransferPayload[];
};

export type InitiateBulkTransferResponsePayload = {
  status: boolean;
  message: string;
  data: Pick<
    Transfer,
    | "reference"
    | "recipient"
    | "amount"
    | "transfer_code"
    | "currency"
    | "status"
  >[];
};

export type ListTransfersPayload = {
  /**
   * Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
   */
  perPage?: number;
  /**
   * Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
   */
  page?: number;
  /** Filter by the recipient ID */
  recipient: number;
  /**
   * A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  from?: string | Date;
  /**
   * A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  to?: string | Date;
};

type Recipient = {
  active: boolean;
  createdAt: string;
  currency: Currency;
  description: string | null;
  domain: string;
  email: string;
  id: number;
  integration: number;
  metadata: Record<string, unknown>;
  name: string;
  recipient_code: `RCP_${string}`;
  type: string;
  updatedAt: string;
  is_deleted: boolean;
  isDeleted: boolean;
  details: Details;
};

export type ListTransfersResponsePayload =
  ListTransferRecipientsResponsePayload;

export type FetchTransferResponsePayload = {
  status: boolean;
  message: string;
  data: Omit<Transfer, "transfersessionid" | "transfertrials"> & {
    recipient: Recipient;
    session: {
      id: string | null;
      provider: string | null;
    };
    fee_charged: number;
    fees_breakdown: string | null;
    gateway_response: string | null;
  };
};

export type CreateTransferClient = {
  /** Initiate a transfer */
  initiate: (
    payload: InitiateTransferPayload,
  ) => Promise<InitiateTransferResponsePayload>;
  /** Finalize a transfer */
  finalize: (payload: {
    transfer_code: string;
    otp: string;
  }) => Promise<FinalizeTransferResponsePayload>;
  /** Initiate bulk transfers */
  initiateBulk: (
    payload: InitiateBulkTransferPayload,
  ) => Promise<InitiateBulkTransferResponsePayload>;
  /** List transfers */
  list: (payload: ListTransfersPayload) => Promise<ListTransfersResponsePayload>;
  /** Fetch a transfer */
  fetch: (payload: {
    id_or_code: string;
  }) => Promise<FetchTransferResponsePayload>;
  /** Verify a transfer */
  verify: (payload: {
    reference: string;
  }) => Promise<FetchTransferResponsePayload>;
};
