import { z } from "zod/v4-mini";
import { PaginationSchema } from "#/schemas";
import type {
  CreateSubscriptionPayload,
  ListSubscriptionPayload,
} from "./types";

export const CreateSubscriptionPayloadSchame = z.object({
  customer: z.string(),
  plan: z.string(),
  authorization: z.optional(z.string()),
  start_date: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateSubscriptionPayload>;

export const ListSubscriptionPayloadSchema = z.extend(PaginationSchema, {
  customer: z.optional(z.number()),
  plan: z.optional(z.number()),
}) satisfies z.ZodMiniType<ListSubscriptionPayload>;
