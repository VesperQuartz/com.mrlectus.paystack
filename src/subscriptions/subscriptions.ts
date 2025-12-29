import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
	CreateSubscriptionPayloadSchame,
	ListSubscriptionPayloadSchema,
} from "./schema";
import type {
	CreateSubscriptionClient,
	CreateSubscriptionPayload,
	CreateSubscriptionResponsePayload,
	FetchSubscriptionResponsePayload,
	ListSubscriptionPayload,
	ListSubscriptionResponsePayload,
} from "./types";

export const createSubscriptions = (
	instance: KyInstance,
): CreateSubscriptionClient => {
	const create = async (payload: CreateSubscriptionPayload) => {
		const data = CreateSubscriptionPayloadSchame.parse(payload);
		return await instance
			.post("subscription", {
				json: data,
			})
			.json<CreateSubscriptionResponsePayload>();
	};

	const list = async (payload: ListSubscriptionPayload = {}) => {
		const data = ListSubscriptionPayloadSchema.parse(payload);
		return await instance
			.get("subscription", {
				searchParams: data,
			})
			.json<ListSubscriptionResponsePayload>();
	};

	const fetch = async (payload: { id_or_code: string }) => {
		const data = z
			.object({
				id_or_code: z.string(),
			})
			.parse(payload);
		return await instance
			.get(`subscription/${data.id_or_code}`)
			.json<FetchSubscriptionResponsePayload>();
	};

	const enable = async (payload: { code: string; token: string }) => {
		const data = z
			.object({
				code: z.string(),
				token: z.string(),
			})
			.parse(payload);
		return await instance
			.post(`subscription/enable`, {
				json: data,
			})
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	const disable = async (payload: { code: string; token: string }) => {
		const data = z
			.object({
				code: z.string(),
				token: z.string(),
			})
			.parse(payload);
		return await instance
			.post(`subscription/disable`, {
				json: data,
			})
			.json<{
				status: boolean;
				message: string;
			}>();
	};

	const generateUpdatelink = async (payload: { code: string }) => {
		const data = z
			.object({
				code: z.string(),
			})
			.parse(payload);
		return await instance.get(`subscription/${data.code}/manage/link`).json<{
			status: boolean;
			message: string;
			data: {
				link: string;
			};
		}>();
	};

	const sendUpdatelink = async (payload: { code: string }) => {
		const data = z
			.object({
				code: z.string(),
			})
			.parse(payload);
		return await instance.post(`subscription/${data.code}/manage/email`).json<{
			status: boolean;
			message: string;
		}>();
	};

	return {
		create,
		list,
		fetch,
		enable,
		disable,
		generateUpdatelink,
		sendUpdatelink,
	};
};
