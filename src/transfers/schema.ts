import { z } from "zod/v4-mini";
import { CurrencySchema } from "#/schemas";
import type {
  InitiateBulkTransferPayload,
  InitiateTransferPayload,
  ListTransfersPayload,
} from "#/transfers/types";

export const InitiateTransferPayloadSchema = z.object({
  source: z.literal("balance"),
  amount: z.number().check(z.positive()),
  recipient: z.string(),
  reference: z.string().check(z.minLength(16), z.maxLength(50)),
  reason: z.optional(z.string()),
  currency: z.optional(CurrencySchema),
  account_reference: z.optional(z.string()),
}) satisfies z.ZodMiniType<InitiateTransferPayload>;

export const InitiateBulkTransferPayloadSchema = z.object({
  source: z.literal("balance"),
  transfers: z.array(InitiateTransferPayloadSchema),
}) satisfies z.ZodMiniType<InitiateBulkTransferPayload>;

export const ListTransfersPayloadSchema = z.object({
  perPage: z.optional(z.int()),
  page: z.optional(z.int()),
  recipient: z.number(),
  from: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
  to: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
}) satisfies z.ZodMiniType<ListTransfersPayload>;
