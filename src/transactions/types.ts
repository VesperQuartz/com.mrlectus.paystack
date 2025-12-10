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
	 * Amount should be in the subunit of the supported currency
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	amount: string;
	/**
	 * Customer's email address
	 */
	email: string;
	/**
	 * An array of payment channels to control what channels you want to make available to the user on the Checkout. Available channels include: `["card", "bank", "apple_pay", "ussd", "qr", "mobile_money", "bank_transfer", "eft", "payattitude"]`
	 */
	channels: PaymentChannel[];
	/**
	 * The transaction currency. Defaults to your integration currency.
	 * @see https://paystack.com/docs/api/#supported-currency
	 */
	currency?: string | undefined;
	/**
	 * Unique transaction reference. Only `-`,`.`,`=` and alphanumeric characters allowed.
	 */
	reference?: string | undefined;
	/**
	 * Fully qualified url, e.g. https://example.com/ . Use this to override the callback url provided on the dashboard for this transaction
	 */
	callback_url?: string | undefined;
	/**
	 * If transaction is to create a subscription to a predefined plan, provide plan code here. This would invalidate the value provided in `amount`
	 */
	plan?: string | undefined;
	/**
	 * Number of times to charge customer during subscription to plan
	 */
	invoice_limit?: number | undefined;
	/**
	 * Stringified JSON object of custom data. Kindly check the Metadata page for more information.
	 * @see https://paystack.com/docs/payments/metadata
	 */
	metadata?: Record<string, unknown> | undefined;
	/**
	 * The split code of the transaction split. e.g. `SPL_98WF13Eb3w`
	 */
	split_code?: string | undefined;
	/**
	 * The code for the subaccount that owns the payment. e.g. `ACCT_8f4s1eq7ml6rlzj`
	 */
	subaccount?: string | undefined;
	/**
	 * An amount used to override the split configuration for a single split payment. If set, the amount specified goes to the main account regardless of the split configuration.
	 */
	transaction_charge?: number | undefined;
	/**
	 * Use this param to indicate who bears the transaction charges. Allowed values are: `account` or `subaccount` (defaults to `account`).
	 */
	bearer?: "account" | "subaccount" | undefined;
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

