import { z } from "zod/v4-mini";
import type { CreateSubscriptionPayload, ListSubscriptionPayload } from "./types";

export const CreateSubscriptionPayloadSchame = z.object({
  customer: z.string(),
  plan: z.string(),
  authorization: z.optional(z.string()),
  start_date: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateSubscriptionPayload>;

export const ListSubscriptionPayloadSchema = z.object({
  perPage: z.optional(z.number()),
  page: z.optional(z.number()),
  customer: z.optional(z.number()),
  plan: z.optional(z.number()),
}) satisfies z.ZodMiniType<ListSubscriptionPayload>;
