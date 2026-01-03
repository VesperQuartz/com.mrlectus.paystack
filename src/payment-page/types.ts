import type { Product } from "#/products";
import type { Currency } from "#/types";

export type CreatePaymentPagePayload = {
  /** @description Name of page */
  name: string;
  /** @description A description for this page */
  description?: string;
  /** @description Amount should be in the subunit of the supported currency */
  amount?: number;
  /** @description The transaction currency. Defaults to your integration currency. */
  currency?: Currency;
  /** @description URL slug you would like to be associated with this page. Page will be accessible at https://paystack.com/pay/[slug] */
  slug?: string;
  /** @description The type of payment page to create. Options are `payment`, `subscription`, `product`, and `plan`. Defaults to payment if no type is specified. */
  type?: "payment" | "subscription" | "product" | "plan";
  /** @description The ID of the plan to subscribe customers on this payment page to when `type` is set to `subscription`. */
  plan?: string;
  /** @description Specifies whether to collect a fixed amount on the payment page. If true, `amount` must be passed. */
  fixed_amount?: boolean;
  /** @description The split code of the transaction split. e.g. `SPL_98WF13Eb3w` */
  split_code?: string;
  /** @description Extra data to configure the payment page including subaccount, logo image, transaction charge description, and more. */
  metadata?: Record<string, unknown>;
  /** @description If you would like Paystack to redirect someplace upon successful payment, specify the URL here. */
  redirect_url?: string;
  /** @description A success message to display to the customer after a successful transaction */
  success_message?: string;
  /** @description An email address that will receive transaction notifications for this payment page */
  notification_email?: string;
  /** @description Specify whether to collect phone numbers on the payment page */
  collect_phone?: boolean;
  /** @description If you would like to accept custom fields, specify them here. */
  custom_fields?: unknown[];
};

export type PaymentPage = {
  name: string;
  description: string;
  amount: number;
  split_code: string;
  integration: number;
  domain: string;
  slug: string;
  currency: Currency;
  type: string;
  collect_phone: boolean;
  active: boolean;
  published: boolean;
  migrate: boolean;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatePaymentPageResponsePayload = {
  status: boolean;
  message: string;
  data: PaymentPage;
};

export type ListPaymentPagePayload = {
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

type ProductMeta = {
  total: number;
  skipped: number;
  perPage: number;
  page: number;
  pageCount: number;
};

export type ListPaymentPageResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<PaymentPage[]>;
  meta: ProductMeta;
};

export type FetchPaymentPageResponsePayload = {
  status: boolean;
  message: string;
  data: PaymentPage & { products: Partial<Product[]> };
};

export type UpdatePaymentPagePayload = {
  /** @description Page ID or slug */
  id_or_slug: string;
  /** @description Name of page */
  name: string;
  /** @description A description for this page */
  description: string;
  /** @description Default amount you want to accept using this page. If none is set, customer is free to provide any amount of their choice. The latter scenario is useful for accepting donations */
  amount?: number;
  /** @description Set to false to deactivate page url */
  active?: boolean;
};

export type CreatePaymentPageClient = {
  /** @description Create a payment page on your integration */
  create: (payload: CreatePaymentPagePayload) => Promise<CreatePaymentPageResponsePayload>;
  /** @description List payment pages available on your integration */
  list: (payload?: ListPaymentPagePayload) => Promise<ListPaymentPageResponsePayload>;
  /** @description Get details of a payment page on your integration */
  fetch: (payload: {
    /** The page `ID` or `slug` you want to fetch */
    id_or_slug: string;
  }) => Promise<FetchPaymentPageResponsePayload>;
  /** @description Update a payment page's details on your integration */
  update: (payload: UpdatePaymentPagePayload) => Promise<CreatePaymentPageResponsePayload>;
  /** @description Check the availability of a slug for a payment page */
  checkSlugAvailability: (payload: {
    /** URL slug to be confirmed */
    slug: string;
  }) => Promise<{ status: boolean; message: string }>;
  /** @description Add products to a payment page */
  addProduct: (payload: {
    /** Id of the payment page */
    id: number;
    /** Ids of all the products */
    product: number[];
  }) => Promise<FetchPaymentPageResponsePayload>;
};
