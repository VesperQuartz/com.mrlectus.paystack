import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import { ListMandateAuthorizationsSchema } from "./schema";
import type {
	ListMandateAuthorizationsPayload,
	ListMandateAuthorizationsResponsePayload,
} from "./types";

export const createDirectDebit = (instance: KyInstance) => {
	const triggerActivationCharge = async (payload: {
		customer_ids: number[];
	}) => {
		const data = z
			.object({
				customer_ids: z.array(z.number()),
			})
			.parse(payload);
		return await instance
			.put(`directdebit/activation-charge`, {
				json: data,
			})
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	const listMandateAuthorizations = async (
		payload: ListMandateAuthorizationsPayload,
	) => {
		const data = ListMandateAuthorizationsSchema.parse(payload);
		return await instance
			.get("directdebit/mandate-authorizations", {
				searchParams: data,
			})
			.json<ListMandateAuthorizationsResponsePayload>();
	};

	return {
		triggerActivationCharge,
		listMandateAuthorizations,
	};
};
