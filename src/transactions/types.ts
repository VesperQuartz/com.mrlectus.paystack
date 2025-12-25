import type { Currency, Nullable } from "../types";

export type PaymentChannel =
	| "card"
	| "bank"
	| "apple_pay"
	| "ussd"
	| "qr"
	| "mobile_money"
	| "bank_transfer"
	| "eft"
	| "payattitude";

export type InitializePayload = {
	/**
	 * @description Amount should be in the subunit of the supported currency
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	amount: string;
	/**
	 * @description Customer's email address
	 */
	email: string;
	/**
	 * @description An array of payment channels to control what channels you want to make available to the user on the Checkout. Available channels include: `["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer", "eft", "payattitude"]`
	 */
	channels: PaymentChannel[];
	/**
	 * @description The transaction currency. Defaults to your integration currency.
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	currency?: Currency;
	/**
	 * @description Unique transaction reference. Only `-`,`.`,`=` and alphanumeric characters allowed.
	 */
	reference?: string;
	/**
	 * @description Fully qualified url, e.g. https://example.com/ . Use this to override the callback url provided on the dashboard for this transaction
	 */
	callback_url?: string;
	/**
	 * @description If transaction is to create a subscription to a predefined plan, provide plan code here. This would invalidate the value provided in `amount`
	 */
	plan?: string;
	/**
	 * @description Number of times to charge customer during subscription to plan
	 */
	invoice_limit?: number;
	/**
	 * @description Stringified JSON object of custom data. Kindly check the Metadata page for more information.
	 * @see https://paystack.com/docs/payments/metadata
	 */
	metadata?: Record<string, unknown>;
	/**
	 * @description The split code of the transaction split. e.g. `SPL_98WF13Eb3w`
	 */
	split_code?: string;
	/**
	 * @description The code for the subaccount that owns the payment. e.g. `ACCT_8f4s1eq7ml6rlzj`
	 */
	subaccount?: string;
	/**
	 * @description An amount used to override the split configuration for a single split payment. If set, the amount specified goes to the main account regardless of the split configuration.
	 */
	transaction_charge?: number;
	/**
	 * @description Use this param to indicate who bears the transaction charges. Allowed values are: `account` or `subaccount` (defaults to `account`).
	 */
	bearer?: "account" | "subaccount";
};

export type InitializePayloadResponse = {
	status: string;
	message: string;
	data: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
};

export type VerifyPayload = {
	/**
	 * @description The transaction reference used to intiate the transaction
	 */
	reference: string;
};

export type TransactionMeta = {
	next: string;
	previous: string | null;
	perPage: number;
};

export type Log = {
	start_time: number;
	time_spent: number;
	attempts: number;
	errors: number;
	success: boolean;
	mobile: boolean;
	input: unknown[];
	history: {
		type: string;
		message: string;
		time: number;
	}[];
};

export type Authorization = Nullable<{
	authorization_code: `AUTH_${string}`;
	bin: string;
	last4: string;
	exp_month: string;
	exp_year: string;
	channel: PaymentChannel;
	card_type: string;
	bank: string;
	country_code: string;
	brand: string;
	reusable: boolean;
	signature: `SIG_${string}`;
	account_name: string | null;
}>;

export type Customer = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	email: string;
	customer_code: `CUS_${string}`;
	phone: string | null;
	metadata: unknown;
	risk_action: "default" | (string & {});
	international_format_phone?: string | null;
};

export type VerifyResponsePayload = {
	status: boolean;
	message: string;
	data: {
		id: number;
		domain: string;
		status: "success" | (string & {});
		reference: string;
		receipt_number: string | null;
		amount: number;
		messsage: string | null;
		gateway_response: string;
		paid_at: string;
		created_at: string;
		channel: PaymentChannel | (string & object);
		currency: Currency;
		ip_address: string | null;
		metadata: string;
		log?: Log;
		fees: number;
		fees_split: string | null;
		authorization: Authorization;
		customer: Customer;
		plan: string | null;
		split: object;
		order_id: string | null;
		paidAt: string;
		createdAt: string;
		requested_amount: number;
		pos_transaction_data: string | null;
		source: string | null;
		fees_breakdown: string | null;
		connect: string | null;
		transaction_date: string;
		plan_object?: object;
		subaccount?: object;
	};
};

export type ListPayload = {
	/**
	 * @description Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
	 */
	perPage?: number;
	/**
	 * @description Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
	 */
	page?: number;
	/**
	 * @description Specify an ID for the customer whose transactions you want to retrieve.
	 */
	customer?: number;
	/**
	 * @description The Terminal ID for the transactions you want to retrieve.
	 */
	terminalid?: string;
	/**
	 * @description Filter transactions by status ('failed', 'success', 'abandoned')
	 */
	status?: "failed" | "success" | "abandoned";
	/**
	 * @description A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	from?: string | Date;
	/**
	 * @description A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
	 */
	to?: string | Date;
	/**
	 * @description Filter transactions by amount using the supported currency code
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	amount?: number;
};

export type ListResponsePayload = {
	status: boolean;
	message: string;
	data: VerifyResponsePayload["data"][];
	meta: TransactionMeta;
};

export type ChargeAuthorizationPayload = {
	/**
	 * @description Amount should be in the subunit of the supported currency
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	amount: string;
	/**
	 * @description Customer's email address
	 */
	email: string;
	/**
	 * @description Valid authorization code to charge
	 */
	authorization_code: string;
	/**
	 * @description Unique transaction reference. Only `-`, `.`, `=` and alphanumeric characters allowed.
	 */
	reference?: string;
	/**
	 * @description Currency in which amount should be charged.
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	currency?: Currency;
	/**
	 * @description Stringified JSON object. Add a custom_fields attribute which has an array of objects if you would like the fields to be added to your transaction when displayed on the dashboard.
	 * @example
	 * ```json
	 * {
	 * 	"custom_fields": [
	 * 		{ "display_name": "Cart ID", "variable_name": "cart_id", "value": "8393" }
	 * 	]
	 * }
	 * ```
	 */
	metadata?: string;
	/**
	 * @description Send us 'card' or 'bank' or 'card','bank' as an array to specify what options to show the user paying
	 */
	channel?: PaymentChannel[];
	/**
	 * @description The code for the subaccount that owns the payment.
	 * @example
	 * `ACCT_8f4s1eq7ml6rlzj`
	 */
	subaccount?: string;
	/**
	 * @description A flat fee to charge the subaccount for this transaction in the subunit of the supported currency. This overrides the split percentage set when the subaccount was created. Ideally, you will need to use this if you are splitting in flat rates (since subaccount creation only allows for percentage split).
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	transaction_charge?: number;
	/**
	 * @description Who bears Paystack charges? `account` or `subaccount` (defaults to `account`).
	 */
	bearer?: "account" | "subaccount";
	/**
	 * @description If you are making a scheduled charge call, it is a good idea to queue them so the processing system does not get overloaded causing transaction processing errors. Send queue:true to take advantage of our queued charging.
	 */
	queue?: boolean;
};

export type ViewTimelineResponsePayload = {
	status: boolean;
	message: string;
	data: Log;
};

export type TransactionTotalPayload = {
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

export type TransactionTotalResponsePayload = {
	status: boolean;
	message: string;
	data: {
		total_transactions: number;
		total_volume: number;
		total_volume_by_currency: {
			currency: Currency;
			amount: number;
		}[];
		pending_transfers: number;
		pending_transfers_by_currency: {
			currency: Currency;
			amount: number;
		}[];
	};
};

export type ExportTransactionPayload = {
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
	/**
	 * @description Specify an ID for the customer whose transactions you want to retrieve.
	 */
	customer?: number;
	/**
	 * @description Filter transactions by status ('failed', 'success', 'abandoned')
	 */
	status?: "failed" | "success" | "abandoned";
	/**
	 * @description Specify the transaction currency to export
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	currency?: Currency;
	/**
	 * @description Filter transactions by amount using the supported currency code
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	amount?: number;
	/**
	 * @description Set to `true` to export only settled transactions. `false` for pending transactions. Leave undefined to export all transactions
	 */
	settled?: boolean;
	/**
	 * @description An ID for the settlement whose transactions we should export
	 */
	settlement?: number;
	/**
	 * @description Specify a payment page's id to export only transactions conducted on said page
	 */
	payment_page?: number;
};

export type ExportTransactionResponsePayload = {
	status: boolean;
	message: string;
	data: {
		path: string;
		expiresAt: string;
	};
};

export type PartialDebitPayload = {
	/**
	 * @description Authorization Code
	 */
	authorization_code: `AUTH_${string}`;
	/**
	 * @description Specify the currency you want to debit. Allowed values are NGN or GHS.
	 */
	currency: Currency;
	/**
	 * @description Amount should be in the subunit of the supported currency
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	amount: string;
	/**
	 * @description Customer's email address (attached to the authorization code)
	 */
	email: string;
	/**
	 * @description Unique transaction reference. Only `-`,`.`,`=` and alphanumeric characters allowed.
	 */
	reference?: string;
	/**
	 * @description Minimum amount to charge
	 */
	at_least?: string;
};

export type PartialDebitResponsePayload = {
	status: boolean;
	message: string;
	data: {
		amount: number;
		currency: Currency;
		transaction_date: string;
		status: "success" | (string & {});
		reference: string;
		domain: string;
		metadata: string;
		gateway_response: string;
		message: string | null;
		channel: PaymentChannel;
		ip_address: string | null;
		log?: Log | null;
		fees: number;
		authorization: Authorization;
		customer: Customer;
		plan: number;
		requested_amount: number;
		id: number;
	};
};

export type TransactionsClient = {
	/**
	 * @description Initialize a transaction from your backend
	 */
	initialize: (
		payload: InitializePayload,
	) => Promise<InitializePayloadResponse>;

	/**
	 * @description Confirm the status of a transaction
	 *
	 * **IMPORTANT: Transaction ID data type**
	 * If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more, check out our changelog.
	 * @see https://paystack.com/docs/changelog/api/#june-2022
	 */
	verify: (payload: VerifyPayload) => Promise<VerifyResponsePayload>;

	/**
	 * @description List transactions carried out on your integration
	 *
	 * **IMPORTANT: Transaction ID data type**
	 * If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more, check out our changelog.
	 * @see https://paystack.com/docs/changelog/api/#june-2022
	 */
	list: (payload?: ListPayload) => Promise<ListResponsePayload>;

	/**
	 * @description Get details of a transaction carried out on your integration
	 *
	 * **IMPORTANT: Transaction ID data type**
	 * If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more, check out our changelog.
	 * @see https://paystack.com/docs/changelog/api/#june-2022
	 */

	fetch: (payload: {
		/**
		 * @description An ID for the transaction to fetch
		 */
		id: number;
	}) => Promise<VerifyResponsePayload>;

	/**
	 * @description All authorizations marked as reusable can be charged with this endpoint whenever you need to receive payments
	 */
	chargeAuthorization: (
		payload: ChargeAuthorizationPayload,
	) => Promise<VerifyResponsePayload>;

	/**
	 * @description View the timeline of a transaction
	 */
	viewTimeline: (payload: {
		/**
		 * @description The ID or the reference of the transaction
		 */
		id_or_reference: string;
	}) => Promise<ViewTimelineResponsePayload>;

	/**
	 * @description Total amount received on your account
	 */
	transactionTotals: (
		payload?: TransactionTotalPayload,
	) => Promise<TransactionTotalResponsePayload>;

	/**
	 * @description Export a list of transactions carried out on your integration
	 */
	exportTransaction: (
		payload?: ExportTransactionPayload,
	) => Promise<ExportTransactionResponsePayload>;

	/**
	 * @description Retrieve part of a payment from a customer
	 */
	partialDebit: (
		payload: PartialDebitPayload,
	) => Promise<PartialDebitResponsePayload>;
};

