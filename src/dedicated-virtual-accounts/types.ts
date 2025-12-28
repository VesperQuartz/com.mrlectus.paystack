import type { Currency } from "../types";

export type CreateDedicatedVirtualAccountPayload = {
	/** @description Customer ID or code */
	customer: string;
	/**
	 * @description The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint.
	 * @see The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint.
	 */
	preferred_bank?: "wema-bank" | "titan-paystack" | (string & {});
	/** @description Subaccount code of the account you want to split the transaction with */
	subaccount?: string;
	/** @description Split code consisting of the lists of accounts you want to split the transaction with */
	split_code?: string;
	/** @description Customer's first name */
	first_name?: string;
	/** @description Customer's last name */
	last_name?: string;
	/** @description Customer's phone number */
	phone?: string;
};

export type Bank = {
	slug: "wema-bank" | "titan-paystack" | (string & {});
	name: string;
	id: number;
};

export type Assignment = {
	integration: number;
	assignee_id: number;
	assignee_type: string;
	expired: boolean;
	account_type: string;
	assigned_at: string;
};

export type Customer = {
	id: number;
	first_name: string;
	last_name: string;
	customer_code: `CUS_${string}`;
	email: string;
	phone: string;
	risk_action: "default" | "allow" | "deny" | (string & {});
	international_format_phone?: string | null;
};

export type DedicatedVirtualAccount = {
	bank: Bank;
	account_name: string;
	account_number: string;
	assigned: boolean;
	currency: string;
	metadata: unknown | null;
	active: boolean;
	id: number;
	created_at: string;
	updated_at: string;
	assignment: Assignment;
	customer: Customer;
};

export type CreateDedicatedVirtualAccountResponsePayload = {
	status: boolean;
	message: string;
	data: DedicatedVirtualAccount;
};

export type AssignDedicatedVirtualAccountPayload = {
	/** @description The email address of the customer. */
	email: string;
	/** @description The first name of the customer. */
	first_name: string;
	/** @description The last name of the customer. */
	last_name: string;
	/** @description The phone number of the customer. */
	phone: string;
	/** @description The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint. */
	preferred_bank: "wema-bank" | "titan-paystack" | (string & {});
	/** @description Currently accepts `NG` and `GH` only */
	country: "NG" | "GH" | (string & {});
	/** @description Customer's account number */
	account_number?: string;
	/** @description Bank Verification Number */
	bvn?: string;
	/** @description Customer's bank code */
	bank_code?: string;
	/** @description Subaccount code of the account you want to split the transaction with */
	subaccount?: string;
	/** @description Split code consisting of the lists of accounts you want to split the transaction with */
	split_code?: string;
};

export type ListDedicatedVirtualAccountsPayload = {
	/** @description Status of the dedicated virtual account */
	active: boolean;
	/** @description The currency of the dedicated virtual account. Only `NGN` and `GHS` are currently allowed */
	currency: "NGN" | "GHS";
	/** @description The bank's slug in lowercase, without spaces e.g. `wema-bank` */
	provider_slug?: "wema-bank" | "titan-paystack" | (string & {});
	/** @description The bank's id e.g `034`*/
	bank_id?: string;
	/** @description The customer's ID */
	customer?: string;
};

type Meta = {
	total: number;
	skipped: number;
	perPage: number;
	page: number;
	pageCount: number;
};

export type ListDedicatedVirtualAccountsResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<
		{
			customer: Customer;
			bank: Bank;
			id: number;
			account_name: string;
			account_number: string;
			created_at: string;
			updated_at: string;
			currency: Currency;
			split_config: {
				subaccount: string;
			};
			active: boolean;
			assigned: boolean;
		}[]
	>;
	meta: Meta;
};

export type FetchDedicatedVirtualAccountResponsePayload = {
	status: boolean;
	message: string;
	data: {
		customer: Customer;
		bank: Bank;
		id: number;
		account_name: string;
		account_number: string;
		created_at: string;
		updated_at: string;
		active: boolean;
		assigned: boolean;
		currency: Currency;
		split_config: {
			subaccount: string;
		};
	};
};

export type RequeryDedicatedAccountPayload = {
	/** @description Virtual account number to requery */
	account_number: string;
	/** @description The bank's slug in lowercase, without spaces e.g. wema-bank */
	provider_slug: "wema-bank" | "titan-paystack" | (string & {});
	/** @description The day the transfer was made in `YYYY-MM-DD` format */
	date?: string;
};

export type DeactivateDedicatedAccountResponsePayload = {
	status: boolean;
	message: string;
	data: {
		bank: Bank;
		id: number;
		account_name: string;
		account_number: string;
		created_at: string;
		updated_at: string;
		active: boolean;
		assigned: boolean;
		currency: Currency;
		metadata: unknown | null;
		assignment: Assignment;
	};
};

export type SplitDedicatedAccountTransactionPayload = {
	/** @description The customer's ID */
	customer: string;
	/** @description Subaccount code of the account you want to split the transaction with */
	subaccount?: string;
	/** @description Split code consisting of the lists of accounts you want to split the transaction with */
	split_code?: string;
	/** @description The bank slug for preferred bank. To get a list of available banks, use the List Providers endpoint. */
	preferred_bank?: "wema-bank" | "titan-paystack" | (string & {});
};

export type SplitDedicatedAccountTransactionResponsePayload = {
	status: boolean;
	message: string;
	data: DedicatedVirtualAccount;
};

export type FetchBankProvidersResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<
		{
			provider_slug: string;
			bank_id: number;
			bank_name: string;
			id: number;
		}[]
	>;
};

export type CreateDedicatedAccountClient = {};
