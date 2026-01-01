import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
	type CreatePaymentPageClient,
	type CreatePaymentPagePayload,
	type CreatePaymentPageResponsePayload,
	type FetchPaymentPageResponsePayload,
	type ListPaymentPagePayload,
	ListPaymentPagePayloadSchema,
	type ListPaymentPageResponsePayload,
	type UpdatePaymentPagePayload,
	UpdatePaymentPagePayloadSchema,
} from "#/payment-page";

export const createPaymentPage = (
	instance: KyInstance,
): CreatePaymentPageClient => {
	const create = (payload: CreatePaymentPagePayload) => {
		return instance
			.post("page", {
				json: payload,
			})
			.json<CreatePaymentPageResponsePayload>();
	};

	const list = (payload: ListPaymentPagePayload = {}) => {
		const data = ListPaymentPagePayloadSchema.parse(payload);
		return instance
			.get("page", {
				searchParams: data,
			})
			.json<ListPaymentPageResponsePayload>();
	};

	const fetch = (payload: { id_or_slug: string }) => {
		const data = z.object({ id_or_slug: z.string() }).parse(payload);
		return instance
			.get(`page/${data.id_or_slug}`)
			.json<FetchPaymentPageResponsePayload>();
	};

	const update = (payload: UpdatePaymentPagePayload) => {
		const data = UpdatePaymentPagePayloadSchema.parse(payload);
		const { id_or_slug, ...rest } = data;
		return instance
			.put(`page/${id_or_slug}`, {
				json: rest,
			})
			.json<CreatePaymentPageResponsePayload>();
	};

	const checkSlugAvailability = (payload: { slug: string }) => {
		const data = z.object({ slug: z.string() }).parse(payload);
		return instance.get(`page/check_slug_availability/${data.slug}`).json<{
			status: boolean;
			message: string;
		}>();
	};

	const addProduct = (payload: { id: number; product: number[] }) => {
		const data = z
			.object({
				id: z.number(),
				product: z.array(z.number()).check(z.minLength(1)),
			})
			.parse(payload);
		return instance
			.post(`page/${data.id}/product`, { json: data.product })
			.json<FetchPaymentPageResponsePayload>();
	};

	return {
		create,
		list,
		fetch,
		update,
		checkSlugAvailability,
		addProduct,
	};
};
