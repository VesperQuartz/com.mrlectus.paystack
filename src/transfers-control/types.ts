import type { Currency, MetaV1 } from "#/types";

type Ledger = {
  integration: number;
  domain: string;
  balance: number;
  currency: Currency;
  difference: number;
  reason: string;
  model_responsible: "Transaction";
  model_row: number;
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type FetchBalanceLedgerResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<Ledger>;
  meta: MetaV1;
};

export type CreateTransferControlClient = {
  /**
   * Fetch the available balance on your integration
   * @remarks This is a query.
   */
  checkBalance: () => Promise<{
    status: boolean;
    message: string;
    data: Partial<
      {
        currency: Currency;
        balance: number;
      }[]
    >;
  }>;
  /**
   * Fetch all pay-ins and pay-outs that occured on your integration
   * @remarks This is a query.
   */
  fetchBalanceLedger: () => Promise<FetchBalanceLedgerResponsePayload>;
  /**
   * Generates a new OTP and sends to customer in the event they are having trouble receiving one.
   * @remarks This is a mutation.
   */
  resendOTP: (payload: {
    /** Transfer code */
    transfer_code: string;
    /** Either `resend_otp` or `transfer` */
    reason: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
  /**
   * This is used in the event that you want to be able to complete transfers programmatically without use of OTPs. No arguments required. You will get an OTP to complete the request.
   * @remarks This is a mutation.
   */
  disableOTP: () => Promise<{
    status: boolean;
    message: string;
  }>;
  /**
   * Finalize the request to disable OTP on your transfers.
   * @remarks This is a mutation.
   */
  finalizeDisableOTP: (payload: {
    /** OTP sent to business phone to verify disabling OTP requirement */
    otp: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;
  /**
   * In the event that a customer wants to stop being able to complete transfers programmatically, this endpoint helps turn OTP requirement back on. No arguments required.
   * @remarks This is a mutation.
   */
  enableOTP: () => Promise<{
    status: boolean;
    message: string;
  }>;
};
