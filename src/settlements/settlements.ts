import type { KyInstance } from "ky";
import {
	ListSettlementsPayloadSchema,
	ListSettlementTransactionsPayloadSchema,
} from "#/settlements/schema";
import type {
	CreateSettlementsClient,
	ListSettlementsPayload,
	ListSettlementsResponsePayload,
	ListSettlementTransactionsPayload,
} from "#/settlements/types";

export const createSettlements = (
	instance: KyInstance,
): CreateSettlementsClient => {
	const list = (payload: ListSettlementsPayload) => {
		const data = ListSettlementsPayloadSchema.parse(payload);
		return instance
			.get("settlement", {
				searchParams: data,
			})
			.json<ListSettlementsResponsePayload>();
	};

	const listTransactions = (payload: ListSettlementTransactionsPayload) => {
		const data = ListSettlementTransactionsPayloadSchema.parse(payload);
		const { id, ...rest } = data;
		return instance
			.get(`settlement/${id}/transactions`, {
				searchParams: rest,
			})
			.json<ListSettlementsResponsePayload>();
	};

	return {
		list,
		listTransactions,
	};
};
