export type CreateIntegrationClient = {
  /**
   * Fetch the payment session timeout on your integration
   */
  fetchTimeout: () => Promise<{
    status: boolean;
    message: string;
    data: {
      payment_session_timeout: number;
    };
  }>;
  /**
   * Update the payment session timeout on your integration
   */
  updateTimeout: (payload: {
    /** Time before stopping session (in seconds). Set to 0 to cancel session timeouts */
    timeout: number;
  }) => Promise<{
    status: boolean;
    message: string;
    data: {
      payment_session_timeout: number;
    };
  }>;
};
