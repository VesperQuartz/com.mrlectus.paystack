import type { Customer } from "../customers";
import type { Plans } from "../plans";
import type { Authorization } from "../transactions";

export type CreateSubscriptionPayload = {
	/** @description Customer's email address or customer code */
	customer: string;
	/** @description Plan code */
	plan: string;
	/** @description If customer has multiple authorizations, you can set the desired authorization you wish to use for this subscription here. If this is not supplied, the customer's most recent authorization would be used */
	authorization?: string;
	/** @description Set the date for the first debit. (ISO 8601 format) e.g. `2017-05-16T00:30:13+01:00` */
	start_date?: string;
};

type Subscription = {
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
	id: number;
	createdAt: string;
	updatedAt: string;
	authorization: Authorization;
};

export type CreateSubscriptionResponsePayload = {
	status: boolean;
	message: string;
	data: Subscription;
};

export type ListSubscriptionPayload = {
	/** @description Specify how many records you want to retrieve per page. If not specified, we use a default value of 50. */
	perPage?: number;
	/** @description Specify exactly what page you want to retrieve. If not specified, we use a default value of 1. */
	page?: number;
	/** @description Filter by Customer ID */
	customer?: number;
	/** @description Filter by Plan ID */
	plan?: number;
};

type SubscriptionMeta = {
	total: number;
	skipped: number;
	perPage: number;
	page: number;
	pageCount: number;
};

export type ListSubscriptionResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<{
		customer: Customer;
		plan: Plans;
		authorization: Authorization;
		integration: number;
		domain: string;
		start: number;
		status: string;
		quantity: number;
		amount: number;
		subscription_code: `SUB_${string}`;
		email_token: string;
		easy_cron_id: string;
		cron_expression: string;
		next_payment_date: string;
		open_invoice: `INV_${string}`;
		id: number;
		createdAt: string;
		updatedAt: string;
	}>;
	meta: SubscriptionMeta;
};

export type FetchSubscriptionResponsePayload = {
	status: boolean;
	message: string;
	data: {
		invoices: Partial<unknown[]>;
		customer: Customer;
		plan: Plans;
		authorization: Authorization;
		integration: number;
		domain: string;
		start: number;
		status: string;
		quantity: number;
		amount: number;
		subscription_code: `SUB_${string}`;
		email_token: string;
		easy_cron_id: string;
		cron_expression: string;
		next_payment_date: string;
		open_invoice: `INV_${string}`;
		id: number;
		createdAt: string;
		updatedAt: string;
	};
};

export type CreateSubscriptionClient = {
	/**
	 * @description Create a subscription on your integration
	 */
	create: (
		payload: CreateSubscriptionPayload,
	) => Promise<CreateSubscriptionResponsePayload>;

	/**
	 * @description List subscriptions available on your integration
	 */
	list: (
		payload?: ListSubscriptionPayload,
	) => Promise<ListSubscriptionResponsePayload>;

	/**
	 * @description Get details of a subscription on your integration
	 */
	fetch: (payload: {
		/**
		 * @description The subscription ID or code you want to fetch
		 */
		id_or_code: string;
	}) => Promise<FetchSubscriptionResponsePayload>;

	/**
	 * @description Enable a subscription on your integration
	 */
	enable: (payload: {
		/**
		 * @description Subscription code
		 */
		code: string;
		/**
		 * @description Email token
		 */
		token: string;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;

	/**
	 * @description Disable a subscription on your integration
	 */
	disable: (payload: {
		/**
		 * @description Subscription code
		 */
		code: string;
		/**
		 * @description Email token
		 */
		token: string;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;

	/**
	 * @description Generate a link for relevant steps an subscription update
	 */
	generateUpdatelink: (payload: {
		/**
		 * @description Subscription code
		 */
		code: string;
	}) => Promise<{
		status: boolean;
		message: string;
		data: {
			link: string;
		};
	}>;

	/**
	 * @description Send an email for relevant steps an subscription update
	 */
	sendUpdatelink: (payload: {
		/**
		 * @description Subscription code
		 */
		code: string;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;
};

