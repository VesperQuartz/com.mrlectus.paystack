import { z } from "zod/v4-mini";
import type {
  AddEvidencePayload,
  ListDisputesPayload,
  ResolveDisputePayload,
  UpdateDisputePayload,
} from "#/disputes/types";
import { PaginationSchema } from "#/schemas";

export const ListDisputesPayloadSchema = z.extend(PaginationSchema, {
  transaction: z.optional(z.string()),
  status: z.optional(
    z.enum([
      "awaiting-merchant-feedback",
      "awaiting-bank-feedback",
      "pending",
      "resolved",
    ]),
  ),
}) satisfies z.ZodMiniType<ListDisputesPayload>;

export const UpdateDisputePayloadSchema = z.object({
  id: z.string(),
  refund_amount: z.number().check(z.positive()),
  uploaded_filename: z.optional(z.string()),
}) satisfies z.ZodMiniType<UpdateDisputePayload>;

export const AddEvidencePayloadSchema = z.object({
  id: z.string(),
  customer_email: z.email(),
  customer_name: z.string(),
  customer_phone: z.string().check(z.length(10)),
  service_details: z.string(),
  delivery_address: z.optional(z.string()),
  delivery_date: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
}) satisfies z.ZodMiniType<AddEvidencePayload>;

export const ResolveDisputePayloadSchema = z.object({
  id: z.string(),
  resolution: z.enum(["merchant-accepted", "declined"]),
  message: z.string(),
  refund_amount: z.number().check(z.positive()),
  uploaded_filename: z.string(),
  evidence: z.optional(z.number()),
}) satisfies z.ZodMiniType<ResolveDisputePayload>;
