export type CreateSubaccountPayload = {
  /** Name of business for subaccount */
  business_name: string;
  /** Bank Code for the bank. You can get the list of Bank Codes by calling the List Banks endpoint. */
  bank_code: string;
  /** Bank Account Number */
  account_number: string;
  /** The percentage the main account receives from each payment made to the subaccount */
  percentage_charge: number;
  /** A description of this subaccount */
  description?: string;
  /** A contact email for the subaccount */
  primary_contact_email?: string;
  /** A name for the contact person for this subaccount */
  primary_contact_name?: string;
  /** A phone number to call for this subaccount */
  primary_contact_phone?: string;
  /** Stringified JSON object. Add a `custom_fields` attribute which has an array of objects if you would like the fields to be added to your transaction when displayed on the dashboard. Sample: `{"custom_fields":[{"display_name":"Cart ID","variable_name": "cart_id","value": "8393"}]}` */
  metadata?: string;
};

export type Subaccount = {
  business_name: string;
  account_number: string;
  percentage_charge: number;
  settlement_bank: string;
  currency: string;
  bank: number;
  integration: number;
  domain: string;
  account_name: string;
  product: string;
  managed_by_integration: number;
  subaccount_code: string;
  is_verified: boolean;
  settlement_schedule: string;
  active: boolean;
  migrate: boolean;
  id: number;
  createdAt: string;
  updatedAt: string;
};
export type SubAccountV = {
  integration: number;
  bank: number;
  managed_by_integration: number;
  domain: string;
  subaccount_code: string;
  business_name: string;
  description: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  metadata: unknown | null;
  percentage_charge: number;
  is_verified: boolean;
  settlement_bank: string;
  account_number: string;
  settlement_schedule: string;
  active: boolean;
  migrate: boolean;
  currency: string;
  account_name: string;
  product: string;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateSubaccountResponsePayload = {
  status: boolean;
  message: string;
  data: Subaccount;
};

export type ListSubAccountsPayload = {
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

type SubaccountMeta = {
  total: number;
  skipped: number;
  perPage: number;
  page: number;
  pageCount: number;
};

export type ListSubAccountsResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<SubAccountV>[];
  meta: SubaccountMeta;
};

export type FetchSubAccountResponsePayload = {
  status: boolean;
  message: string;
  data: SubAccountV;
};

export type UpdateSubAccountPayload = {
  /**
   * Subaccount's ID or code
   */
  id_or_code: string;
  /** Name of business for subaccount */
  business_name: string;
  /** A description for this subaccount */
  description: string;
  /** Bank Code for the bank. You can get the list of Bank Codes by calling the List Banks endpoint. */
  bank_code?: string;
  /** Bank Account Number */
  account_number?: string;
  active?: boolean;
  /** The percentage the main account receives from each payment made to the subaccount */
  percentage_charge?: number;
  /** A contact email for the subaccount */
  primary_contact_email?: string;
  /** A name for the contact person for this subaccount */
  primary_contact_name?: string;
  /** A phone number to call for this subaccount */
  primary_contact_phone?: string;
  /** Any of `auto`, `weekly`, `monthly`, `manual`. Auto means payout is T+1 and manual means payout to the subaccount should only be made when requested. Defaults to `auto` */
  settlement_schedule?: "auto" | "weekly" | "monthly" | "manual";
  /** Stringified JSON object. Add a `custom_fields` attribute which has an array of objects if you would like the fields to be added to your transaction when displayed on the dashboard. Sample: `{"custom_fields":[{"display_name":"Cart ID","variable_name": "cart_id","value": "8393"}]}` */
  metadata?: string;
};

export type CreateSubaccountClient = {
  /**
   * Create a subaccount on your integration
   */
  create: (payload: CreateSubaccountPayload) => Promise<CreateSubaccountResponsePayload>;

  /**
   * List subaccounts available on your integration
   */
  list: (payload: ListSubAccountsPayload) => Promise<ListSubAccountsResponsePayload>;

  /**
   * Get details of a subaccount on your integration
   */
  fetch: (payload: {
    /**
     * The subaccount ID or code you want to fetch
     */
    id_or_code: string;
  }) => Promise<FetchSubAccountResponsePayload>;

  /**
   * Update a subaccount's details on your integration
   */
  update: (payload: UpdateSubAccountPayload) => Promise<FetchSubAccountResponsePayload>;
};
