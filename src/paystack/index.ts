import ky from "ky";
import { createApplePay } from "#/apple-pay";
import { createCustomer } from "#/customers";
import { createDedicatedVirtualAccounts } from "#/dedicated-virtual-accounts";
import { createDirectDebit } from "#/direct-debit";
import { PaystackApiError } from "#/errors";
import { createPlans } from "#/plans";
import { createProducts } from "#/products";
import { createSubaccounts } from "#/subaccounts";
import { createSubscriptions } from "#/subscriptions";
import { createTerminal } from "#/terminal";
import { createTransactionSplits } from "#/transaction-splits";
import { createTransactions } from "#/transactions/transactions";
import { createVirtualTerminal } from "#/virtual-terminal";

export const PaystackClient = (secretKey?: string | undefined, config = {}) => {
	if (!secretKey && !process.env.PAYSTACK_SECRET) {
		throw new Error("Secret key is required");
	}
	const kyclient = ky.create({
		prefixUrl: "https://api.paystack.co",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET ?? secretKey}`,
		},
		hooks: {
			afterResponse: [
				async (req) => {
					console.log("FULL REQUEST URL:", req.url);
				},
			],
			beforeError: [
				async (error) => {
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
		 * @description The Transactions API allows you create and manage payments on your integration.
		 */
		transactions: createTransactions(kyclient),
		/**
		 * @description The Transaction Splits API enables merchants split the settlement for a transaction across their payout account, and one or more subaccounts.
		 */
		splits: createTransactionSplits(kyclient),
		/** @description The Terminal API allows you to build delightful in-person payment experiences. */
		terminal: createTerminal(kyclient),
		/** @description The Virtual Terminal API allows you to accept in-person payments without a POS device. */
		virtaulTerminal: createVirtualTerminal(kyclient),
		/** @description The Customers API allows you create and manage customers on your integration. */
		customers: createCustomer(kyclient),
		/** @description The Direct Debit API allows you manage the authorization on your customer's bank accounts. */
		directDebit: createDirectDebit(kyclient),
		/** @description The Dedicated Virtual Account API enables Nigerian and Ghanaian merchants to manage unique payment accounts of their customers. */
		dedicatedVirtualAccount: createDedicatedVirtualAccounts(kyclient),
		/** @description The Apple Pay API allows you register your application's top-level domain or subdomain. */
		applePay: createApplePay(kyclient),
		/** @description The Subaccounts API allows you create and manage subaccounts on your integration. Subaccounts can be used to split payment between two accounts (your main account and a sub account). */
		subaccounts: createSubaccounts(kyclient),
		/** @description The Plans API allows you create and manage installment payment options on your integration. */
		plans: createPlans(kyclient),
		/** @description The Subscriptions API allows you create and manage recurring payment on your integration. */
		subscriptions: createSubscriptions(kyclient),
		/** @description The Products API allows you create and manage inventories on your integration. */
		products: createProducts(kyclient),
	};
};
