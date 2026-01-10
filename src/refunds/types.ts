import type { PaymentChannel } from "#/transactions";
import type { Currency, Pagination } from "#/types";

export type CreateRefundPayload = {
  /** Transaction reference or id */
  transaction: string;
  /** Amount, in the subunit of the supported currency, to be refunded to the customer. Amount is optional(defaults to original transaction amount) and cannot be more than the original transaction amount. */
  amount?: number;
  /** Any of the supported currency */
  currency?: Currency;
  /** Customer reason */
  customer_note?: string;
  /** Merchant reason */
  merchant_note?: string;
};

type Transaction = {
  id: string;
  domain: string;
  reference: string;
  amount: number;
  paid_at: string;
  channel: PaymentChannel;
  currency: Currency;
  authorization: {
    exp_month: string | null;
    exp_year: string | null;
    account_name: string | null;
  };
  customer: {
    international_format_phone: string | null;
  };
  international_format_phone: object;
  subaccount: {
    subaccount: string | null;
  };
  splits: object;
  order_id: string | null;
  paidAt: string;
  pos_transaction_data: string | null;
  source: string | null;
  fees_breakdown: string | null;
};

type Refund = {
  transaction: Transaction;
  integration: number;
  deducted_amount: number;
  channel: string | null;
  merchant_note: string;
  customer_note: string;
  status: string;
  refunded_by: string;
  expected_at: string;
  currency: Currency;
  domain: string;
  amount: number;
  fully_deducted: boolean;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateRefundResponsePauload = {
  status: boolean;
  message: string;
  data: Refund;
};

export type RetryRefundPayload = {
  /** The ID of the previously initiated refund */
  id: number;
  /** An object that contains the customer’s account details for refund */
  refund_account_details: {
    /** The currency of the customer's bank account. It should be the same as the currency the payment was made */
    currency: Currency;
    /** The customer's account number */
    account_number: string;
    /** The ID representing the customer's bank. You can get the list of bank IDs by calling the List Banks endpoint. */
    bank_id: string;
  };
};
type Retry = {
  transaction: number;
  dispute: string | null;
  settlement: string | null;
  id: number;
  domain: string;
  currency: Currency;
  amount: number;
  status: string;
  refunded_at: string | null;
  expected_at: string;
  channel: string;
  refunded_by: string;
  customer_note: string;
  merchant_note: string;
  deducted_amount: number;
  fully_deducted: boolean;
  bank_reference: string | null;
  reason: string;
  customer: string | null;
  initiated_by: string;
  reversed_at: string | null;
  session_id: string | null;
  integration: number;
};
export type RetryRefundResponsePayload = {
  status: boolean;
  message: string;
  data: Retry;
};

export type ListRefundsPayload = Pagination & {
  /** The transaction ID of the refunded transaction */
  transaction: string;
  /** Any of the supported currency */
  currency: Currency;
};

export type ListRefundsResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Retry[]>;
};

export type CreateRefundsClient = {
  /** Initiate a refund */
  create: (
    payload: CreateRefundPayload,
  ) => Promise<CreateRefundResponsePauload>;
  /** Retrieve a refund for a transaction */
  list: (payload: ListRefundsPayload) => Promise<ListRefundsResponsePayload>;
  /** Fetch details of a refund */
  fetch: (payload: { id: number }) => Promise<RetryRefundResponsePayload>;
  /** Retry a refund */
  retry: (payload: RetryRefundPayload) => Promise<RetryRefundResponsePayload>;
};
