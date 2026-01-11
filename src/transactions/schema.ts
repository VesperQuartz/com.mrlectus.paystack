import { z } from "zod/v4-mini";
import { CurrencySchema, PaginationSchema } from "../schemas";
import type {
  ChargeAuthorizationPayload,
  ExportTransactionPayload,
  InitializePayload,
  ListPayload,
  PartialDebitPayload,
  TransactionTotalPayload,
} from "./types";

const paymentChannelSchema = z.enum([
  "card",
  "bank",
  "apple_pay",
  "ussd",
  "qr",
  "mobile_money",
  "bank_transfer",
  "eft",
  "payattitude",
]);

export const InitializePayloadSchema = z.object({
  amount: z.string(),
  email: z.email(),
  channels: z.array(paymentChannelSchema),
  currency: z.optional(CurrencySchema),
  reference: z.optional(z.string()),
  callback_url: z.optional(z.string()),
  plan: z.optional(z.string()),
  invoice_limit: z.optional(z.int()),
  metadata: z.optional(z.record(z.string(), z.unknown())),
  split_code: z.optional(z.string()),
  subaccount: z.optional(z.string()),
  transaction_charge: z.optional(z.int()),
  bearer: z.optional(z.enum(["account", "subaccount"])),
}) satisfies z.ZodMiniType<InitializePayload>;

export const ListPayloadSchema = z.extend(PaginationSchema, {
  customer: z.optional(z.int()),
  terminalid: z.optional(z.string()),
  status: z.optional(z.enum(["failed", "success", "abandoned"])),
  amount: z.optional(z.int()),
}) satisfies z.ZodMiniType<ListPayload>;

export const ChargeAuthorizationPayloadSchema = z.object({
  amount: z.string(),
  email: z.email(),
  authorization_code: z.templateLiteral(["AUTH_", z.string()]),
  reference: z.optional(z.string()),
  currency: z.optional(CurrencySchema),
  metadata: z.optional(z.string()),
  channel: z.optional(z.array(paymentChannelSchema)),
  subaccount: z.optional(z.string()),
  transaction_charge: z.optional(z.int()),
  bearer: z.optional(z.enum(["account", "subaccount"])),
  queue: z.optional(z.boolean()),
}) satisfies z.ZodMiniType<ChargeAuthorizationPayload>;

export const TransactionTotalPayloadSchema = z.extend(PaginationSchema, {
  amount: z.optional(z.int()),
}) satisfies z.ZodMiniType<TransactionTotalPayload>;

export const ExportTransactionPayloadSchema = z.omit(
  z.extend(ListPayloadSchema, {
    customer: z.optional(z.int()),
    settled: z.optional(z.boolean()),
    settlement: z.optional(z.int()),
    payment_page: z.optional(z.int()),
  }),
  {
    terminalid: true,
  },
) satisfies z.ZodMiniType<ExportTransactionPayload>;

export const PartialDebitPayloadSchema = z.object({
  authorization_code: z.templateLiteral(["AUTH_", z.string()]),
  amount: z.string(),
  currency: CurrencySchema,
  email: z.email(),
  at_least: z.optional(z.string()),
  reference: z.optional(z.string()),
}) satisfies z.ZodMiniType<PartialDebitPayload>;
