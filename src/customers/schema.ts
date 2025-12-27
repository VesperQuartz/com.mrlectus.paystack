import { z } from "zod/v4-mini";
import type {
	CreateCustomerPayload,
	InitializeAuthorizationPayload,
	InitializeDirectDebitPayload,
	ListCustomerPayload,
	SetRiskActionPayload,
	UpdateCustomerPayload,
	ValidateCustomerPayload,
} from "./types";

export const CreateCustomerSchemaPayload = z.object({
	email: z.email(),
	first_name: z.optional(z.string()),
	last_name: z.optional(z.string()),
	phone: z.optional(z.string()),
	metadata: z.optional(z.record(z.string(), z.unknown())),
}) satisfies z.ZodMiniType<CreateCustomerPayload>;

export const ListCustomerPayloadSchema = z.object({
	perPage: z.optional(z.number()),
	page: z.optional(z.number()),
	from: z.optional(z.string()),
	to: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListCustomerPayload>;

export const UpdateCustomerPayloadSchema = z.object({
	code: z.string(),
	first_name: z.optional(z.string()),
	last_name: z.optional(z.string()),
	phone: z.optional(z.string()),
	metadata: z.optional(z.record(z.string(), z.unknown())),
}) satisfies z.ZodMiniType<UpdateCustomerPayload>;

export const ValidateCustomerPayloadSchema = z.object({
	code: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	type: z.literal("bank_account"),
	value: z.string(),
	country: z.string(),
	bvn: z.string(),
	bank_code: z.string(),
	account_number: z.string(),
	middle_name: z.optional(z.string()),
}) satisfies z.ZodMiniType<ValidateCustomerPayload>;

export const SetRiskActionPayloadSchema = z.object({
	customer: z.string(),
	risk_action: z.optional(
		z.union([z.literal("default"), z.literal("allow"), z.literal("deny")]),
	),
}) satisfies z.ZodMiniType<SetRiskActionPayload>;

export const InitializeAuthorizationPayloadSchema = z.object({
	email: z.email(),
	channel: z.literal("direct-debit"),
	callback_url: z.optional(z.url()),
	account: z.optional(
		z.object({
			number: z.string(),
			bank_code: z.string(),
		}),
	),
	address: z.optional(
		z.object({
			street: z.string(),
			city: z.string(),
			state: z.string(),
		}),
	),
}) satisfies z.ZodMiniType<InitializeAuthorizationPayload>;

export const InitializeDirectDebitPayloadSchema = z.object({
	id: z.string(),
	account: z.object({
		number: z.string(),
		bank_code: z.string(),
	}),
	address: z.object({
		street: z.string(),
		city: z.string(),
		state: z.string(),
	}),
}) satisfies z.ZodMiniType<InitializeDirectDebitPayload>;
