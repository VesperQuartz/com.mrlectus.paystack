import { z } from "zod/v4-mini";
import type { CreateProductPayload, ListProductPayload } from "#/products";
import { CurrencySchema, PaginationSchema } from "#/schemas";

export const CreateProductPayloadSchema = z.object({
  metadata: z.optional(z.record(z.string(), z.unknown())),
  name: z.string(),
  description: z.string(),
  price: z.number().check(z.positive()),
  currency: CurrencySchema,
  unlimited: z.optional(z.boolean()),
  quantity: z.optional(z.number().check(z.positive())),
}) satisfies z.ZodMiniType<CreateProductPayload>;

export const ListProductPayloadSchema =
  PaginationSchema satisfies z.ZodMiniType<ListProductPayload>;

export const UpdateProductPayloadSchema = z.extend(CreateProductPayloadSchema, {
  id: z.string(),
});
