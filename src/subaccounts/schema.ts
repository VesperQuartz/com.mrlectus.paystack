import { z } from "zod/v4-mini";
import type {
	CreateSubaccountPayload,
	ListSubAccountsPayload,
	UpdateSubAccountPayload,
} from "./types";

export const CreateSubaccountPayloadSchema = z.object({
	business_name: z.string(),
	bank_code: z.string(),
	account_number: z.string(),
	percentage_charge: z.number(),
	description: z.optional(z.string()),
	primary_contact_email: z.optional(z.string()),
	primary_contact_name: z.optional(z.string()),
	primary_contact_phone: z.optional(z.string()),
	metadata: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateSubaccountPayload>;

export const ListSubAccountsPayloadSchema = z.object({
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
}) satisfies z.ZodMiniType<ListSubAccountsPayload>;

export const UpdateSubAccountPayloadSchema = z.object({
	id_or_code: z.string(),
	business_name: z.string(),
	description: z.string(),
	bank_code: z.optional(z.string()),
	account_number: z.optional(z.string()),
	active: z.optional(z.boolean()),
	percentage_charge: z.optional(z.number()),
	primary_contact_email: z.optional(z.string()),
	primary_contact_name: z.optional(z.string()),
	primary_contact_phone: z.optional(z.string()),
	settlement_schedule: z.optional(
		z.enum(["auto", "weekly", "monthly", "manual"]),
	),
	metadata: z.optional(z.string()),
}) satisfies z.ZodMiniType<UpdateSubAccountPayload>;
