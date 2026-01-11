import type { Authorization } from "#/transactions/types";
import type { Currency, MetaV1, Pagination } from "#/types";

export type CreatePlanPayload = {
  /** Name of the plan */
  name: string;
  /** Amount should be in the subunit of the supported currency
   * @see https://paystack.com/docs/api/#supported-currency
   */
  amount: number;
  /** Interval in words. Valid intervals are: `daily`, `weekly`, `monthly`,`quarterly`, `biannually` (every 6 months), `annually`. */
  interval:
    | "daily"
    | "weekly"
    | "monthly"
    | "quarterly"
    | "biannually"
    | "annually";
  /** Description of the plan */
  description?: string;
  /** Set to false if you don't want invoices to be sent to your customers */
  send_invoices?: boolean;
  /** Set to false if you don't want text messages to be sent to your customers */
  send_sms?: boolean;
  /** Currency in which amount is set */
  currency?: Currency;
  /** Number of invoices to raise during subscription to this plan. Can be overridden by specifying an `invoice_limit` while subscribing. */
  invoice_limit?: number;
};

export type Plans = {
  name: string;
  amount: number;
  interval: string;
  integration: number;
  domain: string;
  plan_code: `PLN_${string}`;
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;
  currency: Currency;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePlanResponsePayload = {
  status: boolean;
  message: string;
  data: Plans;
};

export type ListPlansPayload = Pagination & {
  /** Filter list by plans with specified status */
  status?: string;
  /** Filter list by plans with specified interval */
  interval?:
    | "daily"
    | "weekly"
    | "monthly"
    | "quarterly"
    | "biannually"
    | "annually";
  /**  Filter list by plans with specified amount using the supported currency */
  amount?: number;
};

type Subscriptions = {
  customer: number;
  plan: number;
  integration: number;
  domain: string;
  start: number;
  status: string;
  quantity: number;
  amount: number;
  subscription_code: `SUB_${string}`;
  email_token: string;
  authorization: Authorization;
  easy_cron_id: string | null;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: string | null;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type ListPlansResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    {
      subscriptions: Partial<Subscriptions[]>;
      integration: number;
      domain: string;
      name: string;
      plan_code: `PLN_${string}`;
      description: string | null;
      amount: number;
      interval:
        | "daily"
        | "weekly"
        | "monthly"
        | "quarterly"
        | "biannually"
        | "annually";
      send_invoices: boolean;
      send_sms: boolean;
      hosted_page: boolean;
      hosted_page_url: string | null;
      hosted_page_summary: string | null;
      currency: Currency;
      id: number;
      createdAt: string;
      updatedAt: string;
    }[]
  >;
  meta: MetaV1;
};

export type FetchPlansResponsePayload = {
  status: boolean;
  message: string;
  data: {
    subscriptions: Partial<Subscriptions[]>;
    integration: number;
    domain: string;
    name: string;
    plan_code: `PLN_${string}`;
    description: string | null;
    amount: number;
    interval:
      | "daily"
      | "weekly"
      | "monthly"
      | "quarterly"
      | "biannually"
      | "annually";
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    hosted_page_url: string | null;
    hosted_page_summary: string | null;
    currency: Currency;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdatePlanPayload = {
  id_or_code: string;
  /** Set to `true` if you want the existing subscriptions to use the new changes. Set to `false` and only new subscriptions will be changed. Defaults to true when not set. */
  update_existing_subscriptions?: boolean;
} & CreatePlanPayload;

export type CreatePlanClient = {
  /**
   * Create a plan on your integration
   * @remarks This is a mutation.
   */
  create: (payload: CreatePlanPayload) => Promise<CreatePlanResponsePayload>;

  /**
   * List plans available on your integration
   * @remarks This is a query.
   */
  list: (payload: ListPlansPayload) => Promise<ListPlansResponsePayload>;

  /**
   * Get details of a plan on your integration
   * @remarks This is a query.
   */
  fetch: (payload: {
    /**
     * Plan ID or code
     */
    id_or_code: string;
  }) => Promise<FetchPlansResponsePayload>;

  /**
   * Update a plan's details on your integration
   * @remarks This is a mutation.
   */
  update: (payload: UpdatePlanPayload) => Promise<{
    status: boolean;
    message: string;
  }>;
};
