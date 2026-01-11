import type { Authorization, Customer, PaymentChannel } from "#/transactions";
import type { Currency } from "#/types";

export type CreateChargePayload = {
  /** Customer's email address */
  email: string;
  /** Amount in subunit of the supported currency */
  amount: string;
  /** The split code of a previously created split. e.g. `SPL_98WF13Eb3w` */
  split_code?: string;
  /** The code for the subaccount that owns the payment. e.g. `ACCT_8f4s1eq7ml6rlzj` */
  subaccount?: string;
  /** An amount used to override the split configuration for a single split payment. If set, the amount specified goes to the main account regardless of the split configuration. */
  transaction_charge?: number;
  /** Use this param to indicate who bears the transaction charges. Allowed values are: `account` or `subaccount` (defaults to `account`). */
  bearer?: string;
  /** Bank account to charge (don't send if charging an authorization code) */
  bank?: {
    code: string;
    account_number: string;
  };
  /** Takes the settings for the Pay with Transfer (PwT) channel. Pass in the `account_expires_at` param to set the expiry time. */
  bank_transfer?: {
    account_expires_at: string;
  };
  /** USSD type to charge (don't send if charging an authorization code, bank or card) */
  ussd?: object;
  /** Mobile money details (don't send if charging an authorization code, bank or card). Currently supported in Ghana and Kenya only. */
  mobile_money?: object;
  /** Takes a provider parameter with the value set to: `scan-to-pay`. Currently supported in South Africa only. */
  qr?: {
    provider: "scan-to-pay";
  };
  /** An authorization code to charge (don't send if charging a bank account) */
  authorization_code?: string;
  /** 4-digit PIN (send with a non-reusable authorization code) */
  pin?: string;
  /** Used for passing additional details for your post-payment processes */
  metadata?: Record<string, unknown>;
  /** Unique transaction reference. Only `-`, `.` `,` `=` and alphanumeric characters allowed. */
  reference?: string;
  /** This is the unique identifier of the device a user uses in making payment. Only `-`, `.` `,` `=` and alphanumeric characters allowed. */
  device_id?: string;
};

type Charges = {
  amount: number;
  currency: Currency;
  transaction_date: string;
  status: string;
  reference: string;
  domain: string;
  metadata: Record<string, unknown>;
  gateway_response: string;
  message: string | null;
  channel: PaymentChannel;
  ip_address: string;
  log: string | null;
  fees: number;
  authorization: Authorization;
  customer: Customer;
  plan: string | null;
};

export type CreateChargeResponsePayload = {
  status: boolean;
  message: string;
  data: Charges;
};

export type SubmitPinResponsePayload = {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: 10000;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: PaymentChannel;
    currency: Currency;
    ip_address: string;
    metadata: string;
    log: string | null;
    fees: number;
    fees_split: string | null;
    authorization: Authorization;
    customer: Customer;
    plan: string | null;
    split: object;
    order_id: null;
    paidAt: string;
    createdAt: string;
    requested_amount: 10000;
    pos_transaction_data: string | null;
    source: string | null;
    fees_breakdown: string | null;
    transaction_date: string;
    plan_object: object;
    subaccount: object;
  };
};

export type SubmitAddressPayload = {
  /** Address submitted by user */
  address: string;
  /** Reference for ongoing transaction */
  reference: string;
  /** City submitted by user */
  city: string;
  /** State submitted by user */
  state: string;
  /** Zipcode submitted by user */
  zipcode: string;
};

export type CreateChargeClient = {
  /**
   * Initiate a payment by integrating the payment channel of your choice.
   * @remarks This is a mutation.
   */
  create: (
    payload: CreateChargePayload,
  ) => Promise<CreateChargeResponsePayload>;
  /**
   * Submit PIN to continue a charge
   * @remarks This is a mutation.
   */
  submitPin: (payload: {
    /** Reference for transaction that requested pin */
    reference: string;
    /** PIN submitted by user */
    pin: string;
  }) => Promise<SubmitPinResponsePayload>;
  /**
   * Submit OTP to continue a charge
   * @remarks This is a mutation.
   */
  submitOtp: (payload: {
    /** Reference for ongoing transaction */
    reference: string;
    /** OTP submitted by user */
    otp: string;
  }) => Promise<SubmitPinResponsePayload>;
  /**
   * Submit Phone when requested
   * @remarks This is a mutation.
   */
  submitPhone: (payload: {
    /** Reference for ongoing transaction */
    reference: string;
    /** Phone submitted by user */
    phone: string;
  }) => Promise<SubmitPinResponsePayload>;
  /**
   * Submit Birthday when requested
   * @remarks This is a mutation.
   */
  submitBirthday: (payload: {
    /** Reference for ongoing transaction */
    reference: string;
    /** Birthday submitted by user e.g. 2016-09-21 */
    birthday: string;
  }) => Promise<SubmitPinResponsePayload>;
  /**
   * Submit address to continue a charge
   * @remarks This is a mutation.
   */
  submitAddress: (
    payload: SubmitAddressPayload,
  ) => Promise<SubmitPinResponsePayload>;
  /**
   * When you get pending as a charge status or if there was an exception when calling any of the /charge endpoints, wait 10 seconds or more, then make a check to see if its status has changed. Don't call too early as you may get a lot more pending than you should.
   * @remarks This is a query.
   */
  checkPending: (payload: {
    /** The reference to check */
    reference: string;
  }) => Promise<SubmitPinResponsePayload>;
};
