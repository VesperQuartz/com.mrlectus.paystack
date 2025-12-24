import type { KyInstance } from "ky";
import {
	ChargeAuthorizationPayloadSchema,
	ExportTransactionPayloadSchema,
	InitializePayloadSchema,
	ListPayloadSchema,
	PartialDebitPayloadSchema,
	TransactionTotalPayloadSchema,
} from "./schema";
import type {
	ChargeAuthorizationPayload,
	ExportTransactionPayload,
	ExportTransactionResponsePayload,
	InitializePayload,
	InitializePayloadResponse,
	ListPayload,
	ListResponsePayload,
	PartialDebitPayload,
	PartialDebitResponsePayload,
	TransactionTotalPayload,
	TransactionTotalResponsePayload,
	VerifyPayload,
	VerifyResponsePayload,
	ViewTimelineResponsePayload,
} from "./types";

export const createTransactions = (instance: KyInstance) => {
	/**
	 * Initialize a transaction from your backend
	 */
	const initialize = async (payload: InitializePayload) => {
		const data = InitializePayloadSchema.parse(payload);
		return await instance
			.post("transaction/initialize", {
				json: data,
			})
			.json<InitializePayloadResponse>();
	};

	/**
	 * Confirm the status of a transaction
	 *
	 * **IMPORTANT: Transaction ID data type**
	 * If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more, check out our changelog.
	 * @see https://paystack.com/docs/changelog/api/#june-2022
	 */
	const verify = async (payload: VerifyPayload) => {
		return await instance
			.get(`transaction/verify/${payload.reference}`)
			.json<VerifyResponsePayload>();
	};

	/**
	 * List transactions carried out on your integration
	 *
	 * **IMPORTANT: Transaction ID data type**
	 * If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more, check out our changelog.
	 * @see https://paystack.com/docs/changelog/api/#june-2022
	 */
	const list = async (payload: ListPayload = {}) => {
		const params = ListPayloadSchema.parse(payload);
		return await instance
			.get("transaction", {
				searchParams: params,
			})
			.json<ListResponsePayload>();
	};

	/**
	 * Get details of a transaction carried out on your integration
	 *
	 * **IMPORTANT: Transaction ID data type**
	 * If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more, check out our changelog.
	 * @see https://paystack.com/docs/changelog/api/#june-2022
	 */
	const fetch = async (payload: {
		/**
		 * An ID for the transaction to fetch
		 */
		id: number;
	}) => {
		return instance.get(`transaction/${payload.id}`).json<VerifyPayload>();
	};

	/**
	 * All authorizations marked as reusable can be charged with this endpoint whenever you need to receive payments
	 */
	const chargeAuthorization = async (payload: ChargeAuthorizationPayload) => {
		const data = ChargeAuthorizationPayloadSchema.parse(payload);
		return await instance
			.post("transaction/charge_authorization", {
				json: data,
			})
			.json<VerifyResponsePayload>();
	};

	/**
	 * View the timeline of a transaction
	 */
	const viewTimeline = async (payload: {
		/**
		 * The ID or the reference of the transaction
		 */
		id_or_reference: string;
	}) => {
		return await instance
			.get(`transaction/timeline/${payload.id_or_reference}`)
			.json<ViewTimelineResponsePayload>();
	};

	/**
	 * Total amount received on your account
	 */
	const transactionTotals = async (payload: TransactionTotalPayload = {}) => {
		const data = TransactionTotalPayloadSchema.parse(payload);
		return await instance
			.get("transaction/totals", {
				searchParams: data,
			})
			.json<TransactionTotalResponsePayload>();
	};

	/**
	 * Export a list of transactions carried out on your integration
	 */
	const exportTransaction = async (payload: ExportTransactionPayload = {}) => {
		const data = ExportTransactionPayloadSchema.parse(payload);
		return await instance
			.get("transaction/export", {
				searchParams: data,
			})
			.json<ExportTransactionResponsePayload>();
	};

	/**
	 * Retrieve part of a payment from a customer
	 */
	const partialDebit = async (payload: PartialDebitPayload) => {
		const data = PartialDebitPayloadSchema.parse(payload);
		return await instance
			.post("transaction/partial_debit", {
				json: data,
			})
			.json<PartialDebitResponsePayload>();
	};

	return {
		initialize,
		verify,
		list,
		fetch,
		chargeAuthorization,
		viewTimeline,
		transactionTotals,
		exportTransaction,
		partialDebit,
	};
};
