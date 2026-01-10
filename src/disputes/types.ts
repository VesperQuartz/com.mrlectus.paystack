import type { Transaction } from "#/bulk-charges";
import type { Customer } from "#/transactions";
import type { Currency, MetaV1, Pagination } from "#/types";

export type ListDisputesPayload = Pagination & {
  /** Transaction Id */
  transaction?: string;
  /** Dispute Status. Acceptable values: { awaiting-merchant-feedback | awaiting-bank-feedback | pending | resolved } */
  status?:
    | "awaiting-merchant-feedback"
    | "awaiting-bank-feedback"
    | "pending"
    | "resolved";
};

type Dispute = {
  id: number;
  refund_amount: string | null;
  currency: Currency;
  status: "archived" | (string & {});
  resolution: string | null;
  domain: string;
  transaction: Transaction;
  transaction_reference: string | null;
  merchant_transaction_reference?: string | null;
  category: string | null;
  customer: Customer;
  bin: string | null;
  last4: string | null;
  dueAt: string | null;
  resolvedAt: string | null;
  evidence: string | null;
  attachments: string;
  note: string | null;
  history: Partial<
    {
      status: "pending" | (string & {});
      by: string;
      createdAt: string;
    }[]
  >;
  messages: Partial<
    {
      sender: string;
      body: string;
      createdAt: string;
    }[]
  >;
  createdAt: string;
  updatedAt: string;
};

export type ListDisputesResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Dispute[]>;
  meta: MetaV1;
};

export type FetchDisputeResponsePayload = {
  status: boolean;
  message: string;
  data: Dispute;
};

export type UpdateDisputePayload = {
  /** Dispute ID */
  id: string;
  /** The amount to refund, in the subunit of the supported currency */
  refund_amount: number;
  /** filename of attachment returned via response from upload url(GET /dispute/:id/upload_url) */
  uploaded_filename?: string;
};

export type AddEvidencePayload = {
  /** Dispute ID */
  id: string;
  /** Customer email */
  customer_email: string;
  /** Customer name */
  customer_name: string;
  /** Customer phone number */
  customer_phone: string;
  /** Details of service involved */
  service_details: string;
  /** Delivery address */
  delivery_address?: string;
  /** ISO 8601 representation of delivery date (YYYY-MM-DD) */
  delivery_date?: string;
};

export type AddEvidenceResponsePayload = {
  status: boolean;
  message: string;
  data: {
    customer_email: string;
    customer_name: string;
    customer_phone: string;
    service_details: string;
    delivery_address?: string;
    dispute: number;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type ResolveDisputePayload = {
  /** Dispute ID */
  id: string;
  /** Dispute resolution. Accepted values: { merchant-accepted | declined }.*/
  resolution: "merchant-accepted" | "declined";
  /** Reason for resolving */
  message: string;
  /** The amount to refund, in the subunit of the supported currency */
  refund_amount: number;
  /** filename of attachment returned via response from upload url(GET /dispute/:id/upload_url) */
  uploaded_filename: string;
  /** Evidence Id for fraud claims */
  evidence?: number;
};

export type ResolveDisputeResponsePayload = {
  status: boolean;
  message: string;
  data: Dispute & {
    message: {
      dispute: number;
      sender: string;
      body: string;
      id: number;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type CreateDisputeClient = {
  /** List disputes filed against you */
  list: (payload?: ListDisputesPayload) => Promise<ListDisputesResponsePayload>;
  /** Get more details about a dispute. */
  fetch: (payload: { id: string }) => Promise<FetchDisputeResponsePayload>;
  /** This endpoint retrieves the disputes for a particular transaction */
  listTranaction: (payload: {
    id: string;
  }) => Promise<FetchDisputeResponsePayload>;
  /** Update details of a dispute on your integration */
  update: (
    payload: UpdateDisputePayload,
  ) => Promise<ListDisputesResponsePayload>;
  /** Provide evidence for a dispute */
  addEvidence: (
    payload: AddEvidencePayload,
  ) => Promise<AddEvidenceResponsePayload>;
  /** This endpoint retrieves disputes for a particular transaction */
  getUploadUrl: (payload: {
    /** Dispute ID */
    id: string;
    /** The file name, with its extension, that you want to upload. e.g `filename.pdf` */
    upload_filename: string;
  }) => Promise<{
    status: boolean;
    message: string;
    data: {
      signedUrl: string;
      filename: string;
    };
  }>;
  /** Resolve a dispute on your integration */
  resolve: (
    payload: ResolveDisputePayload,
  ) => Promise<ResolveDisputeResponsePayload>;
  /** Export disputes available on your integration */
  exports: (payload: ListDisputesPayload) => Promise<{
    status: boolean;
    message: string;
    data: {
      path: string;
      expiresAt: string;
    };
  }>;
};
