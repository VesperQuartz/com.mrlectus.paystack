export type ListDomainsPayload = {
	/**
	 * @description Flag to enable cursor pagination on the endpoint
	 */
	use_cursor: boolean;
	/**
	 * @description A cursor that indicates your place in the list. It can be used to fetch the next page of the list
	 */
	next?: string;
	/**
	 * @description A cursor that indicates your place in the list. It should be used to fetch the previous page of the list after an intial next request
	 */
	previous?: string;
};

export type ListDomainsResponsePayload = {
	status: boolean;
	message: string;
	data: {
		domainNames: string[];
	};
};

export type CreateApplePayClient = {
	/**
	 * @description Register a top-level domain or subdomain for your Apple Pay integration.
	 */
	registerDomain: (payload: {
		/**
		 * @description Domain name to be registered
		 */
		domainName: string;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;

	/**
	 * @description List all registered domains on your integration.
	 */
	listDomains: (
		payload: ListDomainsPayload,
	) => Promise<ListDomainsResponsePayload>;

	/**
	 * @description Unregister a top-level domain or subdomain previously used for your Apple Pay integration.
	 */
	unregisterDomain: (payload: {
		/**
		 * @description Domain name to be unregistered
		 */
		domainName: string;
	}) => Promise<{
		status: boolean;
		message: string;
	}>;
};

