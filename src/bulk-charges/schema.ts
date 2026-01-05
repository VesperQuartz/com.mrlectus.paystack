import { z } from "zod/v4-mini";
import type {
  FetchChargesBatchPayload,
  InitiateBulkChargePayload,
} from "#/bulk-charges/types";

export const InitiateBulkChargePayloadSchema = z.array(
  z.object({
    authorization: z.string(),
    amount: z.number(),
    reference: z.string(),
  }),
) satisfies z.ZodMiniType<InitiateBulkChargePayload>;

export const ListBulkChargeBatchesPayloadSchema = z.object({
  perPage: z.optional(z.int()),
  page: z.optional(z.int()),
  from: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
  to: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
});

export const FetchChargesBatchPayloadSchema = z.extend(
  ListBulkChargeBatchesPayloadSchema,
  {
    id_or_code: z.string(),
    status: z.enum(["pending", "success", "failed"]),
  },
) satisfies z.ZodMiniType<FetchChargesBatchPayload>;
