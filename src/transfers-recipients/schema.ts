import { z } from "zod/v4-mini";
import { CurrencySchema } from "#/schemas";
import type {
  BulkCreateTransferRecipientPayload,
  CreateTransferRecipientPayload,
  ListTransferRecipientsPayload,
} from "#/transfers-recipients";

export const CreateTransferRecipientPayloadSchema = z.object({
  type: z.enum(["nuban", "ghipss", "mobile_money", "basa"]),
  name: z.string(),
  account_number: z.string(),
  bank_code: z.string(),
  description: z.optional(z.string()),
  currency: z.optional(CurrencySchema),
  authorization_code: z.optional(z.string()),
  metadata: z.optional(z.record(z.string(), z.unknown())),
}) satisfies z.ZodMiniType<CreateTransferRecipientPayload>;

export const BulkCreateTransferRecipientPayloadSchema = z.object({
  batch: z.array(CreateTransferRecipientPayloadSchema).check(z.minLength(1)),
}) satisfies z.ZodMiniType<BulkCreateTransferRecipientPayload>;

export const ListTransferRecipientsSchema = z.object({
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
}) satisfies z.ZodMiniType<ListTransferRecipientsPayload>;

export const UpdateTransferRecipientPayloadSchema = z.object({
  id_or_code: z.string(),
  name: z.string(),
  email: z.optional(z.email()),
});
