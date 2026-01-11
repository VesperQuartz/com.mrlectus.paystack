export type ListDomainsPayload = {
  /**
   * Flag to enable cursor pagination on the endpoint
   */
  use_cursor: boolean;
  /**
   * A cursor that indicates your place in the list. It can be used to fetch the next page of the list
   */
  next?: string;
  /**
   * A cursor that indicates your place in the list. It should be used to fetch the previous page of the list after an intial next request
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
   * Register a top-level domain or subdomain for your Apple Pay integration.
   *
   * > **Domain Registration**
   * > This endpoint can only be called with one domain or subdomain at a time.
   * @remarks This is a mutation.
   */
  registerDomain: (payload: {
    /**
     * Domain name to be registered
     */
    domainName: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * Lists all registered domains on your integration. Returns an empty array if no domains have been added.
   * @remarks This is a query.
   */
  listDomains: (payload: ListDomainsPayload) => Promise<ListDomainsResponsePayload>;

  /**
   * Unregister a top-level domain or subdomain previously used for your Apple Pay integration.
   * @remarks This is a mutation.
   */
  unregisterDomain: (payload: {
    /**
     * Domain name to be unregistered
     */
    domainName: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
};
