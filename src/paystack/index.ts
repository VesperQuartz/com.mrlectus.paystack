import ky from "ky";
import { PaystackApiError } from "../errors";
import { createTransactionSplits } from "../transaction-splits";
import { createTransactions } from "../transactions/transactions";

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
							message: string;
							data?: unknown;
						}>();
						throw new PaystackApiError(errorBody, {
							cause: error,
						});
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
	};
};
