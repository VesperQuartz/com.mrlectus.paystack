import { z } from "zod/v4-mini";
import { PaginationSchema } from "#/schemas";
import type {
  CreateCustomerPayload,
  InitializeAuthorizationPayload,
  InitializeDirectDebitPayload,
  SetRiskActionPayload,
  UpdateCustomerPayload,
  ValidateCustomerPayload,
} from "./types";

export const CreateCustomerSchemaPayload = z.object({
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.optional(z.string()),
  metadata: z.optional(z.record(z.string(), z.unknown())),
}) satisfies z.ZodMiniType<CreateCustomerPayload>;

export const ListCustomerPayloadSchema = PaginationSchema;

export const UpdateCustomerPayloadSchema = z.object({
  code: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  phone: z.optional(z.string()),
  metadata: z.optional(z.record(z.string(), z.unknown())),
}) satisfies z.ZodMiniType<UpdateCustomerPayload>;

export const ValidateCustomerPayloadSchema = z.object({
  code: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  type: z.literal("bank_account"),
  value: z.string(),
  country: z.string(),
  bvn: z.string().check(z.length(11)),
  bank_code: z.string().check(z.length(3)),
  account_number: z.string().check(z.length(10)),
  middle_name: z.optional(z.string()),
}) satisfies z.ZodMiniType<ValidateCustomerPayload>;

export const SetRiskActionPayloadSchema = z.object({
  customer: z.string(),
  risk_action: z.optional(
    z.union([z.literal("default"), z.literal("allow"), z.literal("deny")]),
  ),
}) satisfies z.ZodMiniType<SetRiskActionPayload>;

export const InitializeAuthorizationPayloadSchema = z.object({
  email: z.email(),
  channel: z.literal("direct_debit"),
  callback_url: z.optional(z.url()),
  account: z.optional(
    z.object({
      number: z.string().check(z.length(10)),
      bank_code: z.string().check(z.length(3)),
    }),
  ),
  address: z.optional(
    z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
    }),
  ),
}) satisfies z.ZodMiniType<InitializeAuthorizationPayload>;

export const InitializeDirectDebitPayloadSchema = z.object({
  id: z.string(),
  account: z.object({
    number: z.string().check(z.length(10)),
    bank_code: z.string().check(z.length(3)),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
  }),
}) satisfies z.ZodMiniType<InitializeDirectDebitPayload>;
