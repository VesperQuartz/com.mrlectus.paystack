import { z } from "zod/v4-mini";
import type {
  FetchChargesBatchPayload,
  InitiateBulkChargePayload,
} from "#/bulk-charges/types";
import { PaginationSchema } from "#/schemas";

export const InitiateBulkChargePayloadSchema = z.array(
  z.object({
    authorization: z.string(),
    amount: z.number(),
    reference: z.string(),
  }),
) satisfies z.ZodMiniType<InitiateBulkChargePayload>;

export const ListBulkChargeBatchesPayloadSchema = PaginationSchema;

export const FetchChargesBatchPayloadSchema = z.extend(
  ListBulkChargeBatchesPayloadSchema,
  {
    id_or_code: z.string(),
    status: z.enum(["pending", "success", "failed"]),
  },
) satisfies z.ZodMiniType<FetchChargesBatchPayload>;
