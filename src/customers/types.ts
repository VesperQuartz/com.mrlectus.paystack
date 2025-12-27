import type { Authorization } from "../transactions";

export type CreateCustomerPayload = {
	/**
	 * @description Customer's email address
	 */
	email: string;
	/**
	 * @description Customer's first name
	 */
	first_name?: string;
	/**
	 * @description Customer's last name
	 */
	last_name?: string;
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
	next: string | null;
	previous: string | null;
	perPage: number;
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
	channel: "direct-debit";
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
		channel: "direct-debit" | (string & {});
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
	meta: {
		per_page: number;
		next: string | null;
		count: number;
		total: number;
	};
};

export type CreateCustomerClient = {
	/**
	 * @description Create a customer on your integration
	 */
	create: (
		payload: CreateCustomerPayload,
	) => Promise<CreateCustomerResponsePayload>;

	/**
	 * @description List customers available on your integration
	 */
	list: (payload?: ListCustomerPayload) => Promise<ListCustomerResponsePayload>;

	/**
	 * @description Get the details of a customer
	 */
	fetch: (payload: {
		/**
		 * @description Email or customer code of the customer
		 */
		email_or_code: string;
	}) => Promise<FetchCustomerResponsePayload>;

	/**
	 * @description Update a customer's details on your integration
	 */
	update: (
		payload: UpdateCustomerPayload,
	) => Promise<UpdateCustomerResponsePayload>;

	/**
	 * @description Validate a customer's identification
	 */
	validate: (payload: ValidateCustomerPayload) => Promise<{
		status: boolean;
		message: string;
	}>;

	/**
	 * @description Set a risk action for a customer
	 */
	setRiskAction: (
		payload: SetRiskActionPayload,
	) => Promise<SetRiskActionResponsePayload>;

	/**
	 * @description Initialize an authorization for a customer
	 */
	initializeAuthorization: (
		payload: InitializeAuthorizationPayload,
	) => Promise<InitializeAuthorizationResponsePayload>;

	/**
	 * @description Verify an authorization for a customer
	 */
	verifyAuthorization: (payload: {
		/**
		 * @description The reference of the authorization
		 */
		reference: string;
	}) => Promise<VerifyAuthorizationResponsePayload>;

	/**
	 * @description Initialize a direct debit for a customer
	 */
	initializeDirectDebit: (
		payload: InitializeDirectDebitPayload,
	) => Promise<InitializeAuthorizationResponsePayload>;

	/**
	 * @description Charge a customer for direct debit activation
	 */
	directDebitActivationCharge: (payload: {
		/**
		 * @description The customer ID
		 */
		id: number;
		/**
		 * @description The authorization ID
		 */
		authorization_id: number;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;

	/**
	 * @description Fetch mandate authorizations for a customer
	 */
	fetchMandateAuthorizations: (payload: {
		/**
		 * @description The customer ID
		 */
		id: number;
	}) => Promise<FetchMandateAuthorizationsResponsePayload>;

	/**
	 * @description Deactivate an authorization for a customer
	 */
	deactivateAuthorization: (payload: {
		/**
		 * @description The authorization code
		 */
		authorization_code: string;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;
};

