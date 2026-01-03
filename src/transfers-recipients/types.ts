import type { Currency, MetaV1 } from "#/types";

export type CreateTransferRecipientPayload = {
  /** @description Recipient Type. It could be one of: `nuban`, `ghipss`, `mobile_money` or `basa` */
  type: "nuban" | "ghipss" | "mobile_money" | "basa";
  /** @description The recipient's name according to their account registration.*/
  name: string;
  /** @description Required for all recipient types except authorization */
  account_number: string;
  /** @description Required for all recipient types except authorization. You can get the list of Bank Codes by calling the List Banks endpoint. */
  bank_code: string;
  /** @description A description for this recipient */
  description?: string;
  /** @description Currency for the account receiving the transfer */
  currency?: Currency;
  /** @description An authorization code from a previous transaction */
  authorization_code?: string;
  /** Store additional information about your recipient in a structured format, JSON */
  metadata?: Record<string, unknown>;
};

type Details = {
  authorization_code: string | null;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
};

type Recipient = {
  active: boolean;
  createdAt: string;
  currency: Currency;
  domain: string;
  id: number;
  integration: number;
  name: string;
  recipient_code: `RCP_${string}`;
  type: "nuban" | "ghipss" | "mobile_money" | "basa";
  updatedAt: string;
  is_deleted: boolean;
  details: Details;
};

export type CreateTransferRecipientResponsePayload = {
  status: boolean;
  message: string;
  data: Recipient;
};

export type BulkCreateTransferRecipientPayload = {
  /** @description A list of transfer recipient object. Each object should contain `type`, `name`, and `bank_code`. Any Create Transfer Recipient param can also be passed. */
  batch: CreateTransferRecipientPayload[];
};

export type BulkCreateTransferRecipientResponsePayload = {
  status: boolean;
  message: string;
  data: {
    success: Partial<Recipient[]>;
    errors: Partial<unknown[]>;
  };
};

export type ListTransferRecipientsPayload = {
  /**
   * @description Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
   */
  perPage?: number;
  /**
   * @description Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
   */
  page?: number;
  /**
   * @description A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  from?: string | Date;
  /**
   * @description A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  to?: string | Date;
};

export type ListTransferRecipientsResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Recipient[]>;
  meta: MetaV1;
};

export type UpdateTransferRecipientPayload = {
  /** @description Transfer Recipient's ID or code */
  id_or_code: string;
  /** @description A name for the recipient */
  name: string;
  /** @description Email address of the recipient */
  email?: string;
};

export type CreateTransferRecipientClient = {
  create: (
    payload: CreateTransferRecipientPayload,
  ) => Promise<CreateTransferRecipientResponsePayload>;
  bulkCreate: (
    payload: BulkCreateTransferRecipientPayload,
  ) => Promise<BulkCreateTransferRecipientResponsePayload>;
  list: (
    payload?: ListTransferRecipientsPayload,
  ) => Promise<ListTransferRecipientsResponsePayload>;
  fetch: (payload: {
    id_or_code: string;
  }) => Promise<CreateTransferRecipientResponsePayload>;
  update: (
    payload: UpdateTransferRecipientPayload,
  ) => Promise<CreateTransferRecipientResponsePayload>;
  delete: (payload: {
    id_or_code: string;
  }) => Promise<{ status: boolean; message: string }>;
};
