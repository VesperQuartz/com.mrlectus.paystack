import { z } from "zod/v4-mini";
import type { ListBanksPayload } from "#/miscellaneous/types";
import { CurrencySchema } from "#/schemas";

export const ListBanksPayloadSchema = z.object({
  country: z.enum(["ghana", "kenya", "nigeria", "south africa"]),
  use_cursor: z.boolean(),
  perPage: z.optional(z.number()),
  pay_with_bank_transfer: z.optional(z.boolean()),
  pay_with_bank: z.optional(z.boolean()),
  enabled_for_verification: z.optional(z.boolean()),
  next: z.optional(z.string()),
  previous: z.optional(z.string()),
  gateway: z.optional(z.string()),
  type: z.optional(z.string()),
  currency: z.optional(CurrencySchema),
  include_nip_sort_code: z.optional(z.boolean()),
}) satisfies z.ZodMiniType<ListBanksPayload>;
