import { z } from "zod/v4-mini";
import { CurrencySchema } from "../schemas";
import type { CreatePlanPayload, ListPlansPayload } from "./types";

export const CreatePlanSchemaPayloadSchema = z.object({
  name: z.string(),
  amount: z.number(),
  interval: z.enum(["daily", "weekly", "monthly", "quarterly", "biannually", "annually"]),
  description: z.optional(z.string()),
  send_invoices: z.optional(z.boolean()),
  send_sms: z.optional(z.boolean()),
  currency: z.optional(CurrencySchema),
  invoice_limit: z.optional(z.number()),
}) satisfies z.ZodMiniType<CreatePlanPayload>;

export const ListPlansPayloadSchema = z.object({
  perPage: z.optional(z.number()),
  page: z.optional(z.number()),
  amount: z.optional(z.number()),
  interval: z.optional(
    z.enum(["daily", "weekly", "monthly", "quarterly", "biannually", "annually"]),
  ),
  status: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListPlansPayload>;

export const UpdatePlanPayloadSchema = z.extend(CreatePlanSchemaPayloadSchema, {
  id_or_code: z.string(),
  update_existing_subscriptions: z.optional(z.boolean()),
});
