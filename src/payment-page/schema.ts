import { z } from "zod/v4-mini";
import type {
	CreatePaymentPagePayload,
	ListPaymentPagePayload,
} from "#/payment-page";
import { CurrencySchema } from "#/schemas";

export const CreatePaymentPagePayloadSchema = z.object({
	name: z.string(),
	description: z.optional(z.string()),
	amount: z.optional(z.number()),
	currency: z.optional(CurrencySchema),
	slug: z.optional(z.string()),
	type: z.optional(z.union([z.literal("payment"), z.literal("subscription")])),
	plan: z.optional(z.string()),
	fixed_amount: z.optional(z.boolean()),
	split_code: z.optional(z.string()),
	metadata: z.optional(z.record(z.string(), z.unknown())),
	redirect_url: z.optional(z.string()),
	success_message: z.optional(z.string()),
	notification_email: z.optional(z.string()),
	collect_phone: z.optional(z.boolean()),
	custom_fields: z.optional(z.array(z.unknown())),
}) satisfies z.ZodMiniType<CreatePaymentPagePayload>;

export const ListPaymentPagePayloadSchema = z.object({
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
}) satisfies z.ZodMiniType<ListPaymentPagePayload>;

export const UpdatePaymentPagePayloadSchema = z.object({
	id_or_slug: z.string(),
	name: z.string(),
	description: z.string(),
	amount: z.optional(z.number()),
	active: z.optional(z.boolean()),
});
