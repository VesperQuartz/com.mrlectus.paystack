import { z } from "zod/v4-mini";
import { CurrencySchema, PaginationSchema } from "../schemas";
import type { CreatePlanPayload, ListPlansPayload } from "./types";

export const CreatePlanSchemaPayloadSchema = z.object({
  name: z.string(),
  amount: z.number().check(z.positive()),
  interval: z.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "biannually",
    "annually",
  ]),
  description: z.optional(z.string()),
  send_invoices: z.optional(z.boolean()),
  send_sms: z.optional(z.boolean()),
  currency: z.optional(CurrencySchema),
  invoice_limit: z.optional(z.number().check(z.positive())),
}) satisfies z.ZodMiniType<CreatePlanPayload>;

export const ListPlansPayloadSchema = z.extend(PaginationSchema, {
  amount: z.optional(z.number()),
  interval: z.optional(
    z.enum([
      "daily",
      "weekly",
      "monthly",
      "quarterly",
      "biannually",
      "annually",
    ]),
  ),
  status: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListPlansPayload>;

export const UpdatePlanPayloadSchema = z.extend(CreatePlanSchemaPayloadSchema, {
  id_or_code: z.string(),
  update_existing_subscriptions: z.optional(z.boolean()),
});
