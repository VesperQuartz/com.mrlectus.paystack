import type { KyInstance } from "ky";
import type { InitializePayload, InitializePayloadResponse } from "./types";

export const createTransactions = (instance: KyInstance) => {
	const initialize = async (payload: InitializePayload) => {
		return instance
			.post("transaction/initialize", {
				json: payload,
			})
			.json<InitializePayloadResponse>();
	};
	return {
		initialize,
	};
};
