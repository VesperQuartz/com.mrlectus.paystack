import type { Authorization } from "../transactions";

export type CreateCustomerPayload = {
  /**
   * @description Customer's email address
   */
  email: string;
  /**
   * @description Customer's first name
   */
  first_name: string;
  /**
   * @description Customer's last name
   */
  last_name: string;
  /**
   * @description Customer's phone number
   */
  phone?: string;
  /**
   * @description A set of key/value pairs that you can attach to the customer. It can be used to store additional information in a structured format.
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
   * @description Customer's code
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
  /** @description Email, or customer code of customer to be identified */
  code: string;
  /** @description Customer's first name */
  first_name: string;
  /** @description Customer's last name */
  last_name: string;
  /** @description Predefined types of identification. Only `bank_account` is supported at the moment */
  type: "bank_account";
  /** @description Customer's identification number */
  value: string;
  /** @description 2 letter country code of identification issuer  */
  country: string;
  /** @description Customer's Bank Verification Number */
  bvn: string;
  /**
   * @description You can get the list of Bank Codes by calling the List Banks endpoint. (required if type is bank_account)
   * @see You can get the list of Bank Codes by calling the List Banks endpoint. (required if type is bank_account)
   */
  bank_code: string;
  /** @description Customer's bank account number. (required if `type` is `bank_account`)  */
  account_number: string;
  /** @description Customer's middle name */
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
  /** @description Customer's email address */
  email: string;
  /** @description `direct-debit` is the only supported option for now */
  channel: "direct_debit";
  /** @description Fully qualified url (e.g. https://example.com/) to redirect your customer to. */
  callback_url?: string;
  /** @description Holds the customer's account details. */
  account?: {
    /** @description The customer's account number */
    number: string;
    /** @description The code representing the customer's bank. */
    bank_code: string;
  };
  /** @description Represents the customer's address. */
  address?: {
    /** @description The customer's street */
    street: string;
    /** @description The customer's city */
    city: string;
    /** @description The customer's state */
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
  /** @description The customer ID  */
  id: string;
  /** @description Holds the customer's account details. */
  account: {
    /** @description The customer's account number */
    number: string;
    /** @description The code representing the customer's bank. */
    bank_code: string;
  };
  /** @description Represents the customer's address. */
  address: {
    /** @description The customer's street */
    street: string;
    /** @description The customer's city */
    city: string;
    /** @description The customer's state */
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
   * @description Create a customer on your integration
   *
   * > **Customer Validation**
   * > The first_name, last_name and phone are optional parameters.
   * > However, when creating a customer that would be assigned a Dedicated Virtual Account and your
   * > business category falls under Betting, Financial services, and General Service, then these
   * > parameters become compulsory.
   */
  create: (payload: CreateCustomerPayload) => Promise<CreateCustomerResponsePayload>;

  /**
   * @description List customers available on your integration
   */
  list: (payload?: ListCustomerPayload) => Promise<ListCustomerResponsePayload>;

  /**
   * @description Get details of a customer on your integration.
   */
  fetch: (payload: {
    /**
     * @description An `email` or `customer` code for the customer you want to fetch
     */
    email_or_code: string;
  }) => Promise<FetchCustomerResponsePayload>;

  /**
   * @description Update a customer's details on your integration
   */
  update: (payload: UpdateCustomerPayload) => Promise<UpdateCustomerResponsePayload>;

  /**
   * @description Validate a customer's identity
   */
  validate: (payload: ValidateCustomerPayload) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * @description Whitelist or blacklist a customer on your integration
   */
  setRiskAction: (payload: SetRiskActionPayload) => Promise<SetRiskActionResponsePayload>;

  /**
   * @description Initiate a request to create a reusable authorization code for recurring transactions.
   */
  initializeAuthorization: (
    payload: InitializeAuthorizationPayload,
  ) => Promise<InitializeAuthorizationResponsePayload>;

  /**
   * @description Check the status of an authorization request.
   */
  verifyAuthorization: (payload: {
    /**
     * @description The reference returned in the initialization response
     */
    reference: string;
  }) => Promise<VerifyAuthorizationResponsePayload>;

  /**
   * @description Initialize the process of linking an account to a customer for Direct Debit transactions.
   */
  initializeDirectDebit: (
    payload: InitializeDirectDebitPayload,
  ) => Promise<InitializeAuthorizationResponsePayload>;

  /**
   * @description Trigger an activation charge on an inactive mandate on behalf of your customer.
   */
  directDebitActivationCharge: (payload: {
    /**
     * @description The customer ID attached to the authorization
     */
    id: number;
    /**
     * @description The authorization ID gotten from the initiation response
     */
    authorization_id: number;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * @description Get the list of direct debit mandates associated with a customer.
   */
  fetchMandateAuthorizations: (payload: {
    /**
     * @description The customer ID for the authorizations to fetch
     */
    id: number;
  }) => Promise<FetchMandateAuthorizationsResponsePayload>;

  /**
   * @description Deactivate an authorization for any payment channel.
   */
  deactivateAuthorization: (payload: {
    /**
     * @description The authorization code to be deactivated
     */
    authorization_code: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
};
