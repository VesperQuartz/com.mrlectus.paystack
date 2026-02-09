import ky from "ky";
import { createApplePay } from "#/apple-pay/pay";
import { createBulkCharges } from "#/bulk-charges/bulk";
import { createCharges } from "#/charges/charges";
import { createCustomer } from "#/customers/customers";
import { createDedicatedVirtualAccounts } from "#/dedicated-virtual-accounts/dva";
import { createDirectDebit } from "#/direct-debit/debit";
import { createDisputes } from "#/disputes/disputes";
import { PaystackApiError } from "#/errors";
import { createIntegration } from "#/integration/integration";
import { createMiscellaneous } from "#/miscellaneous/miscellaneous";
import { createPaymentPage } from "#/payment-page/payment-page";
import { createPaymentRequests } from "#/payment-requests/requests";
import { createPlans } from "#/plans/plans";
import { createProducts } from "#/products/products";
import { createRefunds } from "#/refunds/refunds";
import { createSettlements } from "#/settlements/settlements";
import { createSubaccounts } from "#/subaccounts/subaccounts";
import { createSubscriptions } from "#/subscriptions/subscriptions";
import { createTerminal } from "#/terminal/terminal";
import { createTransactionSplits } from "#/transaction-splits/splits";
import { createTransactions } from "#/transactions/transactions";
import { createTransfers } from "#/transfers/transfers";
import { createTransfersControl } from "#/transfers-control/control";
import { createTransferRecipients } from "#/transfers-recipients/recipients";
import { createVerification } from "#/verification/verification";
import { createVirtualTerminal } from "#/virtual-terminal/vterminal";

type ApiConfig = {
  timeout?: number;
  debug?: boolean;
  signal?: AbortSignal | null | undefined;
};

export const PaystackClient = (
  secretKeyOrConfig?: string | ApiConfig,
  config: ApiConfig = {
    debug: false,
  },
) => {
  const providedSecretKey =
    typeof secretKeyOrConfig === "string" ? secretKeyOrConfig : undefined;

  const configWithDefaults =
    typeof secretKeyOrConfig === "object"
      ? secretKeyOrConfig
      : (config ?? { debug: false });

  const secretKey = providedSecretKey ?? process.env.PAYSTACK_SECRET;

  if (!secretKey) {
    throw new Error("Secret key is required");
  }

  const kyclient = ky.create({
    prefixUrl: "https://api.paystack.co",
    timeout: configWithDefaults.timeout ?? 10000,
    signal: configWithDefaults.signal ?? undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    hooks: {
      afterResponse: [
        async (req) => {
          configWithDefaults.debug && console.log("FULL REQUEST URL:", req.url);
        },
      ],
      beforeError: [
        async (error) => {
          console.error("CHECK", error);
          const { response } = error;
          if (response) {
            const errorBody = await response.json<{
              status: boolean;
              statusCode: number;
              message: string;
              data?: unknown;
            }>();
            throw new PaystackApiError(
              { ...errorBody, statusCode: response.status },
              {
                cause: error,
              },
            );
          }
          return error;
        },
      ],
    },
  });
  return {
    /**
     * The Transactions API allows you create and manage payments on your integration.
     */
    transactions: createTransactions(kyclient),
    /**
     * The Transaction Splits API enables merchants split the settlement for a transaction across their payout account, and one or more subaccounts.
     */
    splits: createTransactionSplits(kyclient),
    /** The Terminal API allows you to build delightful in-person payment experiences. */
    terminal: createTerminal(kyclient),
    /** The Virtual Terminal API allows you to accept in-person payments without a POS device. */
    virtualTerminal: createVirtualTerminal(kyclient),
    /** The Customers API allows you create and manage customers on your integration. */
    customers: createCustomer(kyclient),
    /** The Direct Debit API allows you manage the authorization on your customer's bank accounts. */
    directDebit: createDirectDebit(kyclient),
    /** The Dedicated Virtual Account API enables Nigerian and Ghanaian merchants to manage unique payment accounts of their customers. */
    dedicatedVirtualAccount: createDedicatedVirtualAccounts(kyclient),
    /** The Apple Pay API allows you register your application's top-level domain or subdomain. */
    applePay: createApplePay(kyclient),
    /** The Subaccounts API allows you create and manage subaccounts on your integration. Subaccounts can be used to split payment between two accounts (your main account and a sub account). */
    subaccounts: createSubaccounts(kyclient),
    /** The Plans API allows you create and manage installment payment options on your integration. */
    plans: createPlans(kyclient),
    /** The Subscriptions API allows you create and manage recurring payment on your integration. */
    subscriptions: createSubscriptions(kyclient),
    /** The Products API allows you create and manage inventories on your integration. */
    products: createProducts(kyclient),
    /** The Payment Pages API provides a quick and secure way to collect payment for products. */
    paymentPage: createPaymentPage(kyclient),
    /** The Payment Requests API allows you manage requests for payment of goods and services. */
    paymentRequests: createPaymentRequests(kyclient),
    /** The Settlements API allows you gain insights into payouts made by Paystack to your bank account. */
    settlements: createSettlements(kyclient),
    /** The Transfer Recipients API allows you create and manage beneficiaries that you send money to. */
    transferRecipients: createTransferRecipients(kyclient),
    /** The Transfers API allows you automate sending money to your customers. */
    transfers: createTransfers(kyclient),
    /** The Transfers Control API allows you manage settings of your transfers. */
    transfersControl: createTransfersControl(kyclient),
    /** The Bulk Charges API allows you create and manage multiple recurring payments from your customers. */
    bulkCharges: createBulkCharges(kyclient),
    /** The Integration API allows you manage some settings on your integration. */
    integration: createIntegration(kyclient),
    /** The Charge API allows you to configure payment channel of your choice when initiating a payment. */
    charges: createCharges(kyclient),
    /** The Disputes API allows you manage transaction disputes on your integration. */
    disputes: createDisputes(kyclient),
    /** The Refunds API allows you create and manage transaction refunds. */
    refunds: createRefunds(kyclient),
    /** The Verification API allows you to perform KYC processes. */
    verification: createVerification(kyclient),
    /** The Miscellaneous API are supporting APIs that can be used to provide more details to other APIs. */
    miscellaneous: createMiscellaneous(kyclient),
  };
};
