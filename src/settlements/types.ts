import type { Currency } from "#/types";

export type ListSettlementsPayload = {
	/**
	 * @description Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
	 */
	perPage?: number;
	/**
	 * @description Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
	 */
	page?: number;
	/** @description Fetch settlements based on their state. Value can be one of `success`, `processing`, `pending` or `failed`. */
	status?: "success" | "processing" | "failed" | "pending";
	/** @description Provide a subaccount ID to export only settlements for that subaccount. Set to `none` to export only transactions for the account. */
	subaccount?: string;
	/**
	 * @description A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	from?: string | Date;
	/**
	 * @description A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	to?: string | Date;
};

type Settlement = {
	id: number;
	domain: string;
	status: "success" | "processing" | "failed" | "pending";
	currency: Currency;
	integration: number;
	total_amount: number;
	effective_amount: number;
	total_fees: number;
	total_processed: number;
	deductions: string | null;
	settlement_date: string;
	settled_by: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ListSettlementsResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<Settlement[]>;
};

export type ListSettlementTransactionsPayload = Omit<
	ListSettlementsPayload,
	"status" | "subacount"
> & {
	/** @description The settlement ID in which you want to fetch its transactions */
	id: string;
};

export type CreateSettlementsClient = {
	/** @description List settlements made to your integration */
	list: (
		payload?: ListSettlementsPayload,
	) => Promise<ListSettlementsResponsePayload>;
	/** @description Get the transactions that make up a particular settlement */
	listTransactions: (
		payload: ListSettlementTransactionsPayload,
	) => Promise<ListSettlementsResponsePayload>;
};
