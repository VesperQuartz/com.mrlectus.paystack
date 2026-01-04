import type { Authorization } from "../transactions";

export type CreateCustomerPayload = {
  /**
   * Customer's email address
   */
  email: string;
  /**
   * Customer's first name
   */
  first_name: string;
  /**
   * Customer's last name
   */
  last_name: string;
  /**
   * Customer's phone number
   */
  phone?: string;
  /**
   * A set of key/value pairs that you can attach to the customer. It can be used to store additional information in a structured format.
   */
  metadata?: Record<string, unknown>;
};

export type Customer = {
  email: string;
  integration: number;
  domain: string;
  customer_code: `CUS_${string}`;
  id: number;
  identified: boolean;
  identifications: string | null;
  risk_action?: "default" | "allow" | "deny" | (string & {});
  metadata?: Record<string, unknown>;
  transactions?: Partial<unknown[]>;
  subscriptions?: Partial<unknown[]>;
  authorizations?: Partial<Authorization[]>;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCustomerResponsePayload = {
  status: boolean;
  message: string;
  data: Customer;
};

export type ListCustomerPayload = {
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

export type CustomerMeta = {
  per_page: number;
  next: string | null;
  count: number;
  total: number;
};

export type ListCustomerResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Customer[]>;
  meta: CustomerMeta;
};

export type FetchCustomerResponsePayload = {
  status: boolean;
  message: string;
  data: {
    transactions: Partial<unknown[]>;
    subscriptions: Partial<unknown[]>;
    authorizations: Partial<Authorization[]>;
    created_at: string;
    updated_at: string;
    total_transactions: number;
    total_transaction_value: Partial<unknown[]>;
    dedicated_account: string | null;
    identified: boolean;
    identifications: string | null;
  } & Customer;
};

export type UpdateCustomerPayload = {
  /**
   * Customer's code
   */
  code: string;
} & Omit<CreateCustomerPayload, "email">;

export type UpdateCustomerResponsePayload = {
  status: boolean;
  message: string;
  integration: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  metadata?: Record<string, unknown>;
  identified: boolean;
  identifications: string | null;
  domain: string;
  customer_code: `CUS_${string}`;
  id: number;
  transactions: Partial<unknown[]>;
  subscriptions: Partial<unknown[]>;
  authorizations: Partial<Authorization[]>;
  createdAt: string;
  updatedAt: string;
};

export type ValidateCustomerPayload = {
  /** Email, or customer code of customer to be identified */
  code: string;
  /** Customer's first name */
  first_name: string;
  /** Customer's last name */
  last_name: string;
  /** Predefined types of identification. Only `bank_account` is supported at the moment */
  type: "bank_account";
  /** Customer's identification number */
  value: string;
  /** 2 letter country code of identification issuer  */
  country: string;
  /** Customer's Bank Verification Number */
  bvn: string;
  /**
   * You can get the list of Bank Codes by calling the List Banks endpoint. (required if type is bank_account)
   * @see You can get the list of Bank Codes by calling the List Banks endpoint. (required if type is bank_account)
   */
  bank_code: string;
  /** Customer's bank account number. (required if `type` is `bank_account`)  */
  account_number: string;
  /** Customer's middle name */
  middle_name?: string;
};

export type SetRiskActionPayload = {
  customer: string;
  risk_action?: "default" | "allow" | "deny" | (string & {});
};

export type SetRiskActionResponsePayload = {
  status: boolean;
  message: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  metadata: {};
  domain: string;
  identified: boolean;
  identifications: string | null;
  customer_code: `CUS_${string}`;
  risk_action: "default" | "allow" | "deny" | (string & {});
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
};

export type InitializeAuthorizationPayload = {
  /** Customer's email address */
  email: string;
  /** `direct-debit` is the only supported option for now */
  channel: "direct_debit";
  /** Fully qualified url (e.g. https://example.com/) to redirect your customer to. */
  callback_url?: string;
  /** Holds the customer's account details. */
  account?: {
    /** The customer's account number */
    number: string;
    /** The code representing the customer's bank. */
    bank_code: string;
  };
  /** Represents the customer's address. */
  address?: {
    /** The customer's street */
    street: string;
    /** The customer's city */
    city: string;
    /** The customer's state */
    state: string;
  };
};

export type InitializeAuthorizationResponsePayload = {
  status: boolean;
  message: string;
  data: {
    redirect_url: string;
    access_code: string;
    reference: string;
  };
};

export type VerifyAuthorizationResponsePayload = {
  status: boolean;
  message: string;
  data: {
    authorization_code: `AUTH_${string}`;
    channel: "direct_debit" | (string & {});
    bank: string;
    active: boolean;
    customer: {
      code: `CUS_${string}`;
      email: string;
    };
  };
};

export type InitializeDirectDebitPayload = {
  /** The customer ID  */
  id: string;
  /** Holds the customer's account details. */
  account: {
    /** The customer's account number */
    number: string;
    /** The code representing the customer's bank. */
    bank_code: string;
  };
  /** Represents the customer's address. */
  address: {
    /** The customer's street */
    street: string;
    /** The customer's city */
    city: string;
    /** The customer's state */
    state: string;
  };
};

export type FetchMandateAuthorizationsResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    {
      id: number;
      status: "active" | (string & {});
      mandate_id: number;
      authorization_id: number;
      authorization_code: `AUTH_${string}`;
      integration_id: number;
      account_number: string;
      bank_code: string;
      bank_name: string | null;
      authorized_at: string;
      customer: {
        id: number;
        customer_code: `CUS_${string}`;
        email: string;
        first_name: string;
        last_name: string;
      };
    }[]
  >;
  meta: CustomerMeta;
};

export type CreateCustomerClient = {
  /**
   * Create a customer on your integration
   *
   * > **Customer Validation**
   * > The first_name, last_name and phone are optional parameters.
   * > However, when creating a customer that would be assigned a Dedicated Virtual Account and your
   * > business category falls under Betting, Financial services, and General Service, then these
   * > parameters become compulsory.
   */
  create: (payload: CreateCustomerPayload) => Promise<CreateCustomerResponsePayload>;

  /**
   * List customers available on your integration
   */
  list: (payload?: ListCustomerPayload) => Promise<ListCustomerResponsePayload>;

  /**
   * Get details of a customer on your integration.
   */
  fetch: (payload: {
    /**
     * An `email` or `customer` code for the customer you want to fetch
     */
    email_or_code: string;
  }) => Promise<FetchCustomerResponsePayload>;

  /**
   * Update a customer's details on your integration
   */
  update: (payload: UpdateCustomerPayload) => Promise<UpdateCustomerResponsePayload>;

  /**
   * Validate a customer's identity
   */
  validate: (payload: ValidateCustomerPayload) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * Whitelist or blacklist a customer on your integration
   */
  setRiskAction: (payload: SetRiskActionPayload) => Promise<SetRiskActionResponsePayload>;

  /**
   * Initiate a request to create a reusable authorization code for recurring transactions.
   */
  initializeAuthorization: (
    payload: InitializeAuthorizationPayload,
  ) => Promise<InitializeAuthorizationResponsePayload>;

  /**
   * Check the status of an authorization request.
   */
  verifyAuthorization: (payload: {
    /**
     * The reference returned in the initialization response
     */
    reference: string;
  }) => Promise<VerifyAuthorizationResponsePayload>;

  /**
   * Initialize the process of linking an account to a customer for Direct Debit transactions.
   */
  initializeDirectDebit: (
    payload: InitializeDirectDebitPayload,
  ) => Promise<InitializeAuthorizationResponsePayload>;

  /**
   * Trigger an activation charge on an inactive mandate on behalf of your customer.
   */
  directDebitActivationCharge: (payload: {
    /**
     * The customer ID attached to the authorization
     */
    id: number;
    /**
     * The authorization ID gotten from the initiation response
     */
    authorization_id: number;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * Get the list of direct debit mandates associated with a customer.
   */
  fetchMandateAuthorizations: (payload: {
    /**
     * The customer ID for the authorizations to fetch
     */
    id: number;
  }) => Promise<FetchMandateAuthorizationsResponsePayload>;

  /**
   * Deactivate an authorization for any payment channel.
   */
  deactivateAuthorization: (payload: {
    /**
     * The authorization code to be deactivated
     */
    authorization_code: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
};
