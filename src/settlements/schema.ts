import { z } from "zod/v4-mini";

export const ListSettlementsPayloadSchema = z.object({
	perPage: z.optional(z.int()),
	page: z.optional(z.int()),
	status: z.optional(z.enum(["success", "processing", "failed", "pending"])),
	subaccount: z.optional(z.string()),
	from: z.pipe(
		z.optional(z.coerce.date()),
		z.transform((date) => date?.toISOString()),
	),
	to: z.pipe(
		z.optional(z.coerce.date()),
		z.transform((date) => date?.toISOString()),
	),
});

export const ListSettlementTransactionsPayloadSchema = z.omit(
	z.extend(ListSettlementsPayloadSchema, {
		id: z.string(),
	}),
	{
		status: true,
		subaccount: true,
	},
);
