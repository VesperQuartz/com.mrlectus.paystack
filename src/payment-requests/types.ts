import type { Customer } from "#/customers";
import type { Currency, MetaV1 } from "#/types";

export type CreatePaymentRequestPayload = {
  /** Customer id or code */
  customer: string;
  /** Payment request amount. It should be used when line items and tax values aren't specified. */
  amount: number;
  /** ISO 8601 representation of request due date */
  due_date?: Date | string;
  /** A short description of the payment request */
  description?: string;
  /** Array of line items int the format `[{"name":"item 1", "amount":2000, "quantity": 1}]` */
  line_items?: {
    name: string;
    amount: number;
    quantity?: number;
  }[];
  /** Array of taxes to be charged in the format `[{"name":"VAT", "amount":2000}]` */
  tax?: {
    name: "VAT" | (string & {});
    amount: number;
  }[];
  /** Specify the currency of the payment request. Defaults to NGN. */
  currency?: Currency;
  /**  Indicates whether Paystack sends an email notification to customer. Defaults to `true` */
  send_notification?: boolean;
  /** Indicate if request should be saved as draft. Defaults to false and overrides send_notification */
  draft?: boolean;
  /** Set to `true` to create a draft payment request (adds an auto incrementing payment request number if none is provided) even if there are no `line_items` or tax passed */
  has_invoice?: boolean;
  /** Numeric value of the payment request. Payment Requests will start from 1 and auto increment from there. This field is to help override whatever value Paystack decides. Auto increment for subsequent payment requests continue from this point. */
  invoice_number?: number;
  /** The split code of the transaction split. e.g. `SPL_98WF13Eb3w` */
  split_code?: string;
  /** Metadata for the payment request */
  metadata?: Record<string, unknown>;
};

type PaymentRequest = {
  id: number;
  domain: string;
  amount: number;
  currency: Currency;
  due_date: string;
  has_invoice: boolean;
  invoice_number: number;
  description: string;
  line_items: {
    name: string;
    amount: number;
    quantity?: number;
  }[];
  tax: {
    name: "VAT" | (string & {});
    amount: number;
  }[];
  request_code: `PRQ_${string}`;
  status: "pending" | (string & {});
  paid: boolean;
  metadata: unknown;
  notifications: unknown[];
  archived?: boolean;
  source?: string;
  payment_method?: string | null;
  note?: string | null;
  amount_paid?: string | null;
  offline_reference: string;
  integration?: number;
  customer: number | Customer;
  transactions?: Partial<unknown[]>;
  created_at: string;
};

export type CreatePaymentRequestResponsePayload = {
  status: boolean;
  message: string;
  data: PaymentRequest;
};

export type ListPaymentRequestPayload = {
  /** Specify how many records you want to retrieve per page. If not specified, we use a default value of 50. */
  perPage?: number;
  /** Specify exactly what page you want to retrieve. If not specified, we use a default value of 1. */
  page?: number;
  /** Filter by customer ID */
  customer: string;
  /** Filter by payment request status */
  status: string;
  /** Filter by currency */
  currency: Currency;
  /** Show archived payment requests */
  include_archive: string;
  /** A timestamp from which to start listing payment requests e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21` */
  from?: string | Date;
  /** A timestamp from which to start listing payment requests e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21` */
  to?: string | Date;
};

export type ListPaymentRequestResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<PaymentRequest[]>;
  meta: MetaV1;
};

export type FetchPaymentRequestResponsePayload = {
  status: boolean;
  message: string;
  data: PaymentRequest;
};

export type VerifyPaymentRequestResponsePayload = {
  status: boolean;
  message: string;
  data: PaymentRequest & {
    integration: {
      key: string;
      name: string;
      logo: string;
      allowed_currencies: string[];
    };
  };
};

export type PaymentReuestTotalResponsePayload = {
  status: boolean;
  message: string;
  data: {
    pending: Partial<{
      currency: Currency;
      amount: number;
    }>;
    successful: Partial<{
      currency: Currency;
      amount: number;
    }>;
    total: Partial<{
      currency: Currency;
      amount: number;
    }>;
  };
};

export type UpdatePaymentRequestPayload = CreatePaymentRequestPayload & {
  id_or_code: string;
};

export type CreatePaymentRequestClient = {
  /** Create a payment request for a transaction on your integration */
  create: (payload: CreatePaymentRequestPayload) => Promise<CreatePaymentRequestResponsePayload>;
  /** List payment requests available on your integration */
  list: (payload: ListPaymentRequestPayload) => Promise<ListPaymentRequestResponsePayload>;
  /** Get details of a payment request on your integration */
  fetch: (payload: {
    /** The payment request `ID` or `code` you want to fetch */
    id_or_code: string;
  }) => Promise<FetchPaymentRequestResponsePayload>;
  /** Verify details of a payment request on your integration */
  verify: (payload: {
    /** Payment Request code */
    code: string;
  }) => Promise<VerifyPaymentRequestResponsePayload>;
  /** Send notification of a payment request to your customers */
  sendNotification: (payload: {
    /** Payment Request code */
    code: string;
  }) => Promise<{ status: boolean; message: string }>;
  /** Get payment requests metric */
  totals: () => Promise<PaymentReuestTotalResponsePayload>;
  /** Finalize a draft payment request */
  finalize: (payload: {
    /** Payment Request code */
    code: string;
    /** Indicates whether Paystack sends an email notification to customer. Defaults to `true` */
    send_notification?: boolean;
  }) => Promise<CreatePaymentRequestResponsePayload>;
  /** Update a payment request's details on your integration */
  update: (payload: UpdatePaymentRequestPayload) => Promise<CreatePaymentRequestResponsePayload>;
  /** Used to archive a payment request. A payment request will no longer be fetched on list or returned on verify */
  archive: (payload: {
    /** Payment Request code */
    code: string;
  }) => Promise<{ status: boolean; message: string }>;
};
