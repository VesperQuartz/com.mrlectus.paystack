import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
	CreateProductPayloadSchema,
	ListProductPayloadSchema,
	UpdateProductPayloadSchema,
} from "#/products/schema";
import type {
	CreateProductClient,
	CreateProductPayload,
	CreateProductResponsePayload,
	FetchProductResponsePayload,
	ListProductPayload,
	ListProductResponsePayload,
	UpdateProductPayload,
	UpdateProductResponsePayload,
} from "#/products/types";

export const createProducts = (instance: KyInstance): CreateProductClient => {
	const create = async (payload: CreateProductPayload) => {
		const data = CreateProductPayloadSchema.parse(payload);
		return await instance
			.post("product", {
				json: data,
			})
			.json<CreateProductResponsePayload>();
	};

	const list = async (payload: ListProductPayload = {}) => {
		const data = ListProductPayloadSchema.parse(payload);
		return await instance
			.get("product", {
				searchParams: data,
			})
			.json<ListProductResponsePayload>();
	};

	const fetch = async (payload: { id: string }) => {
		const data = z
			.object({
				id: z.string(),
			})
			.parse(payload);
		return await instance
			.get(`product/${data.id}`)
			.json<FetchProductResponsePayload>();
	};

	const update = async (payload: UpdateProductPayload) => {
		const data = UpdateProductPayloadSchema.parse(payload);
		const { id, ...rest } = data;
		return await instance
			.put(`product/${id}`, {
				json: rest,
			})
			.json<UpdateProductResponsePayload>();
	};

	return {
		create,
		list,
		fetch,
		update,
	};
};
