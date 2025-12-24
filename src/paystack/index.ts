import ky from "ky";
import { createTransactions } from "../transactions/transactions";
import { PaystackApiError } from "../errors";

export const PaystackClient = (secretKey?: string | undefined, config = {}) => {
	if (!secretKey || process.env.PAYSTACK_SECRET) {
		throw new Error("Secret key is required");
	}
	const kyclient = ky.create({
		prefixUrl: "https://api.paystack.co",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${process.env.PAYSTACK_SECRET ?? secretKey}`,
		},
		hooks: {
			beforeError: [
				async (error) => {
					const { response } = error;
					if (response) {
						const errorBody = (await response.json()) as {
							status: boolean;
							message: string;
							data?: unknown;
						};
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
		transactions: createTransactions(kyclient),
	};
};
