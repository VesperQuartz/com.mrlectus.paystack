import ky from "ky";
import { PaystackApiError } from "../errors";
import { createTerminal } from "../terminal";
import { createTransactionSplits } from "../transaction-splits";
import { createTransactions } from "../transactions/transactions";
import { createVirtualTerminal } from "../virtual-terminal";

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
	};
};
