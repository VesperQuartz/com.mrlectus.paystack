import { z } from "zod/v4-mini";
import type { CreateProductPayload, ListProductPayload } from "#/products";
import { CurrencySchema } from "#/schemas";

export const CreateProductPayloadSchema = z.object({
	metadata: z.optional(z.record(z.string(), z.unknown())),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	currency: CurrencySchema,
	unlimited: z.optional(z.boolean()),
	quantity: z.optional(z.number()),
}) satisfies z.ZodMiniType<CreateProductPayload>;

export const ListProductPayloadSchema = z.object({
	perPage: z.optional(z.int()),
	page: z.optional(z.int()),
	from: z.pipe(
		z.optional(z.coerce.date()),
		z.transform((date) => date?.toISOString()),
	),
	to: z.pipe(
		z.optional(z.coerce.date()),
		z.transform((date) => date?.toISOString()),
	),
}) satisfies z.ZodMiniType<ListProductPayload>;

export const UpdateProductPayloadSchema = z.extend(CreateProductPayloadSchema, {
	id: z.string(),
});
