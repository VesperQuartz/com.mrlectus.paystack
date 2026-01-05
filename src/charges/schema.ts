import { z } from "zod/v4-mini";
import type {
  CreateChargePayload,
  SubmitAddressPayload,
} from "#/charges/types";

export const CreateChargePayloadSchema = z.object({
  email: z.email(),
  amount: z.string(),
  split_code: z.optional(z.string()),
  subaccount: z.optional(z.string()),
  transaction_charge: z.optional(z.number()),
  bearer: z.optional(z.enum(["account", "subaccount"])),
  bank: z.optional(
    z.object({
      code: z.string(),
      account_number: z.string(),
    }),
  ),
  bank_transfer: z.optional(
    z.object({
      account_expires_at: z.string(),
    }),
  ),
  ussd: z.optional(z.object()),
  mobile_money: z.optional(z.object()),
  qr: z.optional(
    z.object({
      provider: z.literal("scan-to-pay"),
    }),
  ),
  authorization_code: z.optional(z.string()),
  pin: z.optional(z.string().check(z.length(4))),
  metadata: z.optional(z.record(z.string(), z.unknown())),
  reference: z.optional(z.string()),
  device_id: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateChargePayload>;

export const SubmitAddressPayloadSchema = z.object({
  address: z.string(),
  reference: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
}) satisfies z.ZodMiniType<SubmitAddressPayload>;
