import { z } from "zod/v4-mini";
import type { CreatePaymentRequestPayload, ListPaymentRequestPayload } from "#/payment-requests";
import { CurrencySchema } from "#/schemas";

export const CreatePaymentRequestPayloadSchema = z.object({
  customer: z.string(),
  amount: z.number(),
  due_date: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
  description: z.optional(z.string()),
  line_items: z.optional(
    z.array(
      z.object({
        name: z.string(),
        amount: z.number(),
        quantity: z.optional(z.number()),
      }),
    ),
  ),
  tax: z.optional(
    z.array(
      z.object({
        name: z.union([z.literal("VAT"), z.string()]),
        amount: z.number(),
      }),
    ),
  ),
  currency: z.optional(CurrencySchema),
  send_notification: z.optional(z.boolean()),
  draft: z.optional(z.boolean()),
  has_invoice: z.optional(z.boolean()),
  invoice_number: z.optional(z.number()),
  split_code: z.optional(z.string()),
  metadata: z.optional(z.record(z.string(), z.unknown())),
}) satisfies z.ZodMiniType<CreatePaymentRequestPayload>;

export const ListPaymentRequestPayloadSchema = z.object({
  perPage: z.optional(z.int()),
  page: z.optional(z.int()),
  from: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
  customer: z.string(),
  status: z.string(),
  currency: CurrencySchema,
  include_archive: z.string(),
  to: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
}) satisfies z.ZodMiniType<ListPaymentRequestPayload>;

export const UpdatePaymentRequestPayloadSchema = z.extend(CreatePaymentRequestPayloadSchema, {
  id_or_code: z.string(),
});
