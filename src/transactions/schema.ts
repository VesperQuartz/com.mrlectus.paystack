import z from "zod";
import type {
	ChargeAuthorizationPayload,
	ExportTransactionPayload,
	InitializePayload,
	ListPayload,
	PartialDebitPayload,
	TransactionTotalPayload,
} from "./types";

const paymentChannelSchema = z.enum([
	"card",
	"bank",
	"apple_pay",
	"ussd",
	"qr",
	"mobile_money",
	"bank_transfer",
	"eft",
	"payattitude",
]);

export const InitializePayloadSchema = z.object({
	amount: z.string(),
	email: z.email(),
	channels: z.array(paymentChannelSchema),
	currency: z.string().optional(),
	reference: z.string().optional(),
	callback_url: z.string().optional(),
	plan: z.string().optional(),
	invoice_limit: z.number().int().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	split_code: z.string().optional(),
	subaccount: z.string().optional(),
	transaction_charge: z.number().int().optional(),
	bearer: z.enum(["account", "subaccount"]).optional(),
}) satisfies z.ZodType<InitializePayload>;

export const ListPayloadSchema = z.object({
	parPage: z.number().int().optional(),
	page: z.number().int().optional(),
	customer: z.number().int().optional(),
	terminalid: z.string().optional(),
	status: z.enum(["failed", "success", "abandoned"]).optional(),
	from: z.coerce
		.date()
		.optional()
		.transform((date) => date?.toISOString()),
	to: z.coerce
		.date()
		.optional()
		.transform((date) => date?.toISOString()),
	amount: z.number().int().optional(),
}) satisfies z.ZodType<ListPayload>;

export const ChargeAuthorizationPayloadSchema = z.object({
	amount: z.string(),
	email: z.email(),
	authorization_code: z.templateLiteral(["AUTH_", z.string()]),
	reference: z.string().optional(),
	currency: z.string().optional(),
	metadata: z.string().optional(),
	channel: z.array(paymentChannelSchema),
	subaccount: z.string().optional(),
	transaction_charge: z.number().int().optional(),
	bearer: z.enum(["account", "subaccount"]).optional(),
	queue: z.boolean().optional(),
}) satisfies z.ZodType<ChargeAuthorizationPayload>;

export const TransactionTotalPayloadSchema = z.object({
	parPage: z.number().int().optional(),
	page: z.number().int().optional(),
	from: z.coerce
		.date()
		.optional()
		.transform((date) => date?.toISOString()),
	to: z.coerce
		.date()
		.optional()
		.transform((date) => date?.toISOString()),
	amount: z.number().int().optional(),
}) satisfies z.ZodType<TransactionTotalPayload>;

export const ExportTransactionPayloadSchema = ListPayloadSchema.omit({
	terminalid: true,
}).extend({
	customer: z.number().int().optional(),
	settled: z.boolean().optional(),
	settlement: z.number().int().optional(),
	payment_page: z.number().int().optional(),
}) satisfies z.ZodType<ExportTransactionPayload>;

export const PartialDebitPayloadSchema = z.object({
	authorization_code: z.templateLiteral(["AUTH_", z.string()]),
	amount: z.string(),
	currency: z.string(),
	email: z.email(),
	at_least: z.string().optional(),
	reference: z.string().optional(),
}) satisfies z.ZodType<PartialDebitPayload>;
