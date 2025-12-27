import type { Currency } from "../types";

export type CreateSplitPayload = {
	/**
	 * @description Name of the transaction split
	 */
	name: string;
	/**
	 * @description The type of transaction split you want to create. You can use one of the following: percentage | flat
	 */
	type: "percentage" | "flat";
	/**
	 * @description Any of the supported currency
	 */
	currency: Currency;
	/**
	 * @description A list of object containing subaccount code and number of shares: `[{subaccount: ‘ACT_xxxxxxxxxx’, share: xxx},{...}]`
	 */
	subaccounts: {
		subaccount: string;
		share: number;
	}[];
	/**
	 * @description Any of subaccount | account | all-proportional | all
	 */
	bearer_type: "subaccount" | "account" | "all-proportional" | "all";
	/**
	 * @description Subaccount code
	 */
	bearer_subaccount: string;
};

export type Subaccount = {
	id: number;
	subaccount_code: string;
	business_name: string;
	description: string;
	primary_contact_name: string | null;
	primary_contact_email: string | null;
	primary_contact_phone: string | null;
	metadata: unknown;
	settlement_bank: string;
	currency: Currency;
	account_number: string;
};

export type CreateSplit = {
	id: number;
	name: string;
	type: "percentage" | "flat";
	currency: Currency;
	integration: number;
	domain: string;
	split_code: `SPL_${string}`;
	bearer_subaccount?: string | null;
	active: boolean;
	bearer_type: "subaccount" | "account" | "all-proportional" | "all";
	createdAt: string;
	updatedAt: string;
	is_dynamic: boolean;
	total_subaccounts: number;
	subaccounts: Partial<
		{
			subaccount: Subaccount;
			share: number;
		}[]
	>;
};

export type SplitResponsePayload = {
	status: boolean;
	message: string;
	data: CreateSplit;
};

export type ListSplitPayload = {
	/**
	 * @description The name of the split
	 */
	name: string;
	/**
	 * @description Any of true or false
	 */
	active: boolean;
	/**
	 * @description Sort by name, defaults to createdAt date
	 */
	sort_by?: string;
	/**
	 * @description Number of splits per page. If not specified, we use a default value of 50.
	 */
	perPage?: number;
	/**
	 * @description Page number to view. If not specified, we use a default value of 1.
	 */
	page?: number;
	/**
	 * @description A timestamp from which to start listing splits e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	from?: string | Date;
	/**
	 * @description A timestamp at which to stop listing splits e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	to?: string | Date;
};

export type SplitMeta = {
	total: number;
	skipped: number;
	perPage: number;
	page: number;
	pageCount: number;
};

export type ListSplitResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<CreateSplit[]>;
	meta: SplitMeta;
};

export type SplitBase = {
	/**
	 * @description Split ID
	 */
	id: string;
} & Pick<ListSplitPayload, "name" | "active">;

export type UpdateSplitPayload =
	| (SplitBase & {
			/** @description Any of subaccount | account | all-proportional | all */
			bearer_type: "subaccount";
			/**
			 * @description Subaccount code
			 */
			bearer_subaccount: string;
	  })
	| (SplitBase & {
			/** @description Any of subaccount | account | all-proportional | all */
			bearer_type: "account" | "all-proportional" | "all" | "subaccount";
			/**
			 * @description Subaccount code
			 */
			bearer_subaccount?: never;
	  })
	| (SplitBase & {
			/** @description Any of subaccount | account | all-proportional | all */
			bearer_type?: undefined;
			/**
			 * @description Subaccount code
			 */
			bearer_subaccount?: never;
	  });

export type UpdateSubAccountSplitPayload = {
	/**
	 * @description Split ID
	 */
	id: string;
	/**
	 * @description This is the sub account code
	 */
	subaccount: string;
	/**
	 * @description This is the transaction share for the subaccount
	 */
	share: number;
};

export type TransactionSplitsClient = {
	/**
	 * @description Create a split payment on your integration
	 */
	create: (payload: CreateSplitPayload) => Promise<SplitResponsePayload>;

	/**
	 * @description List the transaction splits available on your integration
	 */
	list: (payload: ListSplitPayload) => Promise<ListSplitResponsePayload>;

	/**
	 * @description Get details of a split on your integration
	 */

	fetch: (payload: {
		/**
		 * @description The id of the split
		 */
		id: string;
	}) => Promise<SplitResponsePayload>;

	/**
	 * @description Update a transaction split details on your integration
	 */
	update: (payload: UpdateSplitPayload) => Promise<SplitResponsePayload>;

	/**
	 * @description Add a Subaccount to a Transaction Split, or update the share of an existing Subaccount in a Transaction Split
	 */
	updateSubaccount: (
		payload: UpdateSubAccountSplitPayload,
	) => Promise<SplitResponsePayload>;

	/**
	 * @description Remove a subaccount from a transaction split
	 */
	removeSubaccount: (
		payload: UpdateSubAccountSplitPayload,
	) => Promise<Omit<SplitResponsePayload, "data">>;
};
