import { z } from "zod/v4-mini";
import { PaginationSchema } from "#/schemas";
import type {
  CreateSubaccountPayload,
  ListSubAccountsPayload,
  UpdateSubAccountPayload,
} from "./types";

export const CreateSubaccountPayloadSchema = z.object({
  business_name: z.string(),
  bank_code: z.string().check(z.length(3)),
  account_number: z.string().check(z.length(10)),
  percentage_charge: z.number().check(z.positive()),
  description: z.optional(z.string()),
  primary_contact_email: z.optional(z.email()),
  primary_contact_name: z.optional(z.string()),
  primary_contact_phone: z.optional(z.string().check(z.length(10))),
  metadata: z.optional(z.string()),
}) satisfies z.ZodMiniType<CreateSubaccountPayload>;

export const ListSubAccountsPayloadSchema =
  PaginationSchema satisfies z.ZodMiniType<ListSubAccountsPayload>;

export const UpdateSubAccountPayloadSchema = z.object({
  id_or_code: z.string(),
  business_name: z.string(),
  description: z.string(),
  bank_code: z.optional(z.string().check(z.length(3))),
  account_number: z.optional(z.string().check(z.length(10))),
  active: z.optional(z.boolean()),
  percentage_charge: z.optional(z.number().check(z.positive())),
  primary_contact_email: z.optional(z.email()),
  primary_contact_name: z.optional(z.string()),
  primary_contact_phone: z.optional(z.string()),
  settlement_schedule: z.optional(
    z.enum(["auto", "weekly", "monthly", "manual"]),
  ),
  metadata: z.optional(z.string()),
}) satisfies z.ZodMiniType<UpdateSubAccountPayload>;
