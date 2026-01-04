import type { Currency } from "../types";

export type CreateDedicatedVirtualAccountPayload = {
  /** Customer ID or code */
  customer: string;
  /**
   * The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint.
   * @see The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint.
   */
  preferred_bank?: "wema-bank" | "titan-paystack" | (string & {});
  /** Subaccount code of the account you want to split the transaction with */
  subaccount?: string;
  /** Split code consisting of the lists of accounts you want to split the transaction with */
  split_code?: string;
  /** Customer's first name */
  first_name?: string;
  /** Customer's last name */
  last_name?: string;
  /** Customer's phone number */
  phone?: string;
};

export type Bank = {
  slug: "wema-bank" | "titan-paystack" | (string & {});
  name: string;
  id: number;
};

export type Assignment = {
  integration: number;
  assignee_id: number;
  assignee_type: string;
  expired: boolean;
  account_type: string;
  assigned_at: string;
};

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  customer_code: `CUS_${string}`;
  email: string;
  phone: string;
  risk_action: "default" | "allow" | "deny" | (string & {});
  international_format_phone?: string | null;
};

export type DedicatedVirtualAccount = {
  bank: Bank;
  account_name: string;
  account_number: string;
  assigned: boolean;
  currency: string;
  metadata: unknown | null;
  active: boolean;
  id: number;
  created_at: string;
  updated_at: string;
  assignment: Assignment;
  customer: Customer;
};

export type CreateDedicatedVirtualAccountResponsePayload = {
  status: boolean;
  message: string;
  data: DedicatedVirtualAccount;
};

export type AssignDedicatedVirtualAccountPayload = {
  /** The email address of the customer. */
  email: string;
  /** The first name of the customer. */
  first_name: string;
  /** The last name of the customer. */
  last_name: string;
  /** The phone number of the customer. */
  phone: string;
  /** The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint. */
  preferred_bank: "wema-bank" | "titan-paystack" | (string & {});
  /** Currently accepts `NG` and `GH` only */
  country: "NG" | "GH" | (string & {});
  /** Customer's account number */
  account_number?: string;
  /** Bank Verification Number */
  bvn?: string;
  /** Customer's bank code */
  bank_code?: string;
  /** Subaccount code of the account you want to split the transaction with */
  subaccount?: string;
  /** Split code consisting of the lists of accounts you want to split the transaction with */
  split_code?: string;
};

export type ListDedicatedVirtualAccountsPayload = {
  /** Status of the dedicated virtual account */
  active: boolean;
  /** The currency of the dedicated virtual account. Only `NGN` and `GHS` are currently allowed */
  currency: "NGN" | "GHS";
  /** The bank's slug in lowercase, without spaces e.g. `wema-bank` */
  provider_slug?: "wema-bank" | "titan-paystack" | (string & {});
  /** The bank's id e.g `034`*/
  bank_id?: string;
  /** The customer's ID */
  customer?: string;
};

type Meta = {
  total: number;
  skipped: number;
  perPage: number;
  page: number;
  pageCount: number;
};

export type ListDedicatedVirtualAccountsResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    {
      customer: Customer;
      bank: Bank;
      id: number;
      account_name: string;
      account_number: string;
      created_at: string;
      updated_at: string;
      currency: Currency;
      split_config: {
        subaccount: string;
      };
      active: boolean;
      assigned: boolean;
    }[]
  >;
  meta: Meta;
};

export type FetchDedicatedVirtualAccountResponsePayload = {
  status: boolean;
  message: string;
  data: {
    customer: Customer;
    bank: Bank;
    id: number;
    account_name: string;
    account_number: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    assigned: boolean;
    currency: Currency;
    split_config: {
      subaccount: string;
    };
  };
};

export type RequeryDedicatedAccountPayload = {
  /** Virtual account number to requery */
  account_number: string;
  /** The bank's slug in lowercase, without spaces e.g. wema-bank */
  provider_slug: "wema-bank" | "titan-paystack" | (string & {});
  /** The day the transfer was made in `YYYY-MM-DD` format */
  date?: string;
};

export type DeactivateDedicatedAccountResponsePayload = {
  status: boolean;
  message: string;
  data: {
    bank: Bank;
    id: number;
    account_name: string;
    account_number: string;
    created_at: string;
    updated_at: string;
    active: boolean;
    assigned: boolean;
    currency: Currency;
    metadata: unknown | null;
    assignment: Assignment;
  };
};

export type SplitDedicatedAccountTransactionPayload = {
  /** The customer's ID */
  customer: string;
  /** Subaccount code of the account you want to split the transaction with */
  subaccount?: string;
  /** Split code consisting of the lists of accounts you want to split the transaction with */
  split_code?: string;
  /** The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint. */
  preferred_bank?: "wema-bank" | "titan-paystack" | (string & {});
};

export type SplitDedicatedAccountTransactionResponsePayload = {
  status: boolean;
  message: string;
  data: DedicatedVirtualAccount;
};

export type FetchBankProvidersResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    {
      provider_slug: string;
      bank_id: number;
      bank_name: string;
      id: number;
    }[]
  >;
};

export type CreateDedicatedAccountClient = {
  /** Create a dedicated virtual account for an existing customer. */
  create: (
    payload: CreateDedicatedVirtualAccountPayload,
  ) => Promise<CreateDedicatedVirtualAccountResponsePayload>;

  /** You can create a customer, validate the customer, and assign a DVA to the customer. */
  assign: (payload: AssignDedicatedVirtualAccountPayload) => Promise<{
    status: boolean;
    message: string;
  }>;

  /** List dedicated virtual accounts available on your integration. */
  list: (
    payload: ListDedicatedVirtualAccountsPayload,
  ) => Promise<ListDedicatedVirtualAccountsResponsePayload>;

  /** Get details of a dedicated virtual account on your integration. */
  fetch: (payload: {
    /** The ID of the dedicated virtual account */
    dedicated_account_id: number;
  }) => Promise<FetchDedicatedVirtualAccountResponsePayload>;

  /** Requery a dedicated virtual account for new transactions. */
  requery: (payload: RequeryDedicatedAccountPayload) => Promise<{
    status: boolean;
    message: string;
  }>;

  /** Deactivate a dedicated virtual account on your integration. */
  deactivate: (payload: {
    /** The ID of the dedicated virtual account */
    dedicated_account_id: number;
  }) => Promise<DeactivateDedicatedAccountResponsePayload>;

  /** Split a dedicated virtual account transaction with one or more accounts. */
  splitTransaction: (
    payload: SplitDedicatedAccountTransactionPayload,
  ) => Promise<SplitDedicatedAccountTransactionResponsePayload>;

  /** If you've previously set up split payment for transactions on a dedicated virtual account, you can remove it with this endpoint */
  removeSplit: (payload: {
    /** Dedicated virtual account number */
    account_number: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;

  /** Get the list of available bank providers for dedicated virtual accounts. */
  listBankProviders: () => Promise<FetchBankProvidersResponsePayload>;
};
