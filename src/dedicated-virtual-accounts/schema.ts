import { z } from "zod/v4-mini";
import type {
	AssignDedicatedVirtualAccountPayload,
	CreateDedicatedVirtualAccountPayload,
	ListDedicatedVirtualAccountsPayload,
	RequeryDedicatedAccountPayload,
	SplitDedicatedAccountTransactionPayload,
} from "./types";

export const CreateDedicatedVirtualAccountSchemaPayload = z.object({
	customer: z.string(),
	preferred_bank: z.optional(
		z.union([z.string(), z.enum(["wema-bank", "titan-paystack"])]),
	),
	subaccount: z.optional(z.string()),
	split_code: z.optional(z.string()),
	first_name: z.optional(z.string()),
	last_name: z.optional(z.string()),
	phone: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateDedicatedVirtualAccountPayload>;

export const AssignDedicatedVirtualAccountSchemaPayload = z.object({
	email: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	phone: z.string(),
	preferred_bank: z.union([
		z.string(),
		z.enum(["wema-bank", "titan-paystack"]),
	]),
	country: z.union([z.string(), z.enum(["NG", "GH"])]),
	account_number: z.optional(z.string()),
	bvn: z.optional(z.string()),
	bank_code: z.optional(z.string()),
	subaccount: z.optional(z.string()),
	split_code: z.optional(z.string()),
}) satisfies z.ZodMiniType<AssignDedicatedVirtualAccountPayload>;

export const ListDedicatedVirtualAccountsSchemaPayload = z.object({
	active: z.boolean(),
	currency: z.enum(["NGN", "GHS"]),
	provider_slug: z.optional(
		z.union([z.string(), z.enum(["wema-bank", "titan-paystack"])]),
	),
	bank_id: z.optional(z.string()),
	customer: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListDedicatedVirtualAccountsPayload>;

export const RequeryDedicatedAccountSchemaPayload = z.object({
	account_number: z.string(),
	provider_slug: z.union([z.string(), z.enum(["wema-bank", "titan-paystack"])]),
	date: z.optional(z.iso.date()),
}) satisfies z.ZodMiniType<RequeryDedicatedAccountPayload>;

export const SplitDedicatedAccountTransactionSchemaPayload = z.object({
	customer: z.string(),
	subaccount: z.optional(z.string()),
	split_code: z.optional(z.string()),
	preferred_bank: z.optional(
		z.union([z.string(), z.enum(["wema-bank", "titan-paystack"])]),
	),
}) satisfies z.ZodMiniType<SplitDedicatedAccountTransactionPayload>;
