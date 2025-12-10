import z from "zod";
import type { InitializePayload } from "./types";

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

