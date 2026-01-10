import { z } from "zod/v4-mini";
import type {
  CreateRefundPayload,
  ListRefundsPayload,
  RetryRefundPayload,
} from "#/refunds/types";
import { CurrencySchema, PaginationSchema } from "#/schemas";

export const CreateRefundPayloadSchema = z.object({
  transaction: z.string(),
  amount: z.optional(z.number()),
  currency: z.optional(CurrencySchema),
  customer_note: z.optional(z.string()),
  merchant_note: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateRefundPayload>;

export const RetryRefundPayloadSchema = z.object({
  id: z.number(),
  refund_account_details: z.object({
    currency: CurrencySchema,
    account_number: z.string(),
    bank_id: z.string(),
  }),
}) satisfies z.ZodMiniType<RetryRefundPayload>;

export const ListRefundsPayloadSchema = z.extend(PaginationSchema, {
  transaction: z.string(),
  currency: CurrencySchema,
}) satisfies z.ZodMiniType<ListRefundsPayload>;
