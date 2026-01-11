export type ValidateAccountPayload = {
  /** Customer's first and last name registered with their bank */
  account_name: string;
  /** Customer’s account number */
  account_number: string;
  /** This can take one of: [ `personal`, `business` ] */
  account_type: "personal" | "business";
  /** The bank code of the customer’s bank. You can fetch the bank codes by using our List Banks endpoint */
  bank_code: string;
  /** The two digit ISO code of the customer’s bank */
  country_code: string;
  /** Customer’s mode of identity. This could be one of: [ `identityNumber`, `passportNumber`, `businessRegistrationNumber` ] */
  document_type:
    | "identityNumber"
    | "passportNumber"
    | "businessRegistrationNumber";
  /** Customer’s mode of identity number */
  document_number: string;
};

export type ValidateAccountResponsePayload = {
  status: boolean;
  message: string;
  data: {
    accountAcceptsDebits: boolean;
    accountAcceptsCredits: boolean;
    accountHolderMatch: boolean;
    accountOpenForMoreThanThreeMonths: boolean;
    accountOpen: boolean;
    verified: boolean;
    verificationMessage: string;
  };
};

export type CreateVerificationClient = {
  /**
   * Confirm an account belongs to the right customer
   * @remarks This is a query.
   */
  resolveAccount: (payload: {
    /** Account Number */
    account_number: string;
    /** You can get the list of bank codes by calling the List Banks endpoint */
    bank_code: string;
  }) => Promise<{
    status: boolean;
    message: string;
    data: {
      account_number: string;
      account_name: string;
    };
  }>;
  /**
   * Confirm the authenticity of a customer's account number before sending money
   * @remarks This is a mutation.
   */
  validateAccount: (
    payload: ValidateAccountPayload,
  ) => Promise<ValidateAccountResponsePayload>;
  /**
   * Get more information about a customer's card
   * @remarks This is a query.
   */
  resolveCardBIN: (payload: {
    /** First 6 characters of card */
    bin: string;
  }) => Promise<{
    status: boolean;
    message: string;
    data: {
      bin: string;
      brand: string;
      sub_brand: string;
      country_code: string;
      country_name: string;
      card_type: string;
      bank: string;
      linked_bank_id: number;
    };
  }>;
};
