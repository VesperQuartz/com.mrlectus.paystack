import { z } from "zod/v4-mini";
import { PaginationSchema } from "#/schemas";

export const ListSettlementsPayloadSchema = z.extend(PaginationSchema, {
  status: z.optional(z.enum(["success", "processing", "failed", "pending"])),
  subaccount: z.optional(z.string()),
});

export const ListSettlementTransactionsPayloadSchema = z.omit(
  z.extend(ListSettlementsPayloadSchema, {
    id: z.string(),
  }),
  {
    status: true,
    subaccount: true,
  },
);
