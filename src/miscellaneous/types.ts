import type { Currency, MetaV2 } from "#/types";

export type ListBanksPayload = {
  /** The country from which to obtain the list of supported banks. Accepted values are: `ghana`, `kenya`, `nigeria`, `south africa` */
  country: "ghana" | "kenya" | "nigeria" | "south africa";
  /** Flag to enable cursor pagination on the endpoint */
  use_cursor: boolean;
  /** The number of objects to return per page. Defaults to 50, and limited to 100 records per page. */
  perPage?: number;
  /** A flag to filter for available banks a customer can make a transfer to complete a payment */
  pay_with_bank_transfer?: boolean;
  /** A flag to filter for banks a customer can pay directly from */
  pay_with_bank?: boolean;
  /** A flag to filter the banks that are supported for account verification in South Africa. You need to combine this with either the `currency` or `country` filter. */
  enabled_for_verification?: boolean;
  /** A cursor that indicates your place in the list. It can be used to fetch the next page of the list */
  next?: string;
  /** A cursor that indicates your place in the list. It should be used to fetch the previous page of the list after an intial next request */
  previous?: string;
  /** The gateway type of the bank. It can be one of these: [emandate, digitalbankmandate]  */
  gateway?: string;
  /** Type of financial channel. For Ghanaian channels, please use either mobile_money for mobile money channels OR ghipps for bank channels */
  type?: string;
  /** One of the supported currency */
  currency?: Currency;
  /** A flag that returns Nigerian banks with their `nip institution` code. The returned value can be used in identifying institutions on NIP. */
  include_nip_sort_code?: boolean;
  supports_transfers?: boolean;
  available_for_direct_debit?: boolean;
  is_deleted?: boolean;
};

type Banks = {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: Currency;
  type: string;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type ListBanksResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Banks[]>;
  meta?: MetaV2;
};

export type Country = {
  id: number;
  name: string;
  iso_code: string;
  default_currency_code: string;
  integration_defaults: object;
  relationships: {
    currency: {
      type: string;
      data: Partial<string>;
      supported_currencies: Partial<Record<string, unknown>>;
    };
    integration_feature: {
      type: string;
      data: Partial<string>;
    };
    integration_type: {
      type: string;
      data: Partial<string>;
    };
    payment_method: {
      type: string;
      data: Partial<string>;
    };
  };
};

export type ListCountriesResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Country[]>;
};

export type CreateMiscellaneousClient = {
  /**
   * Get a list of all supported banks and their properties
   * @remarks This is a query.
   */
  listBanks: (payload: ListBanksPayload) => Promise<ListBanksResponsePayload>;
  /**
   * Gets a list of countries that Paystack currently supports
   * @remarks This is a query.
   */
  listCountries: () => Promise<ListCountriesResponsePayload>;
  /**
   * Get a list of states for a country for address verification
   * @remarks This is a query.
   */
  listStates: (payload: {
    /** The country code of the states to list. It is gotten after the charge request. */
    country: number;
  }) => Promise<{
    status: boolean;
    message: string;
    data: Partial<
      {
        name: string;
        slug: string;
        abbreviation: string;
      }[]
    >;
  }>;
};
