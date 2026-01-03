import { z } from "zod/v4-mini";
import { CurrencySchema } from "../schemas";
import type { CreateSplitPayload, UpdateSplitPayload, UpdateSubAccountSplitPayload } from "./types";

export const createSplitPayloadSchema = z.object({
  name: z.string(),
  type: z.enum(["percentage", "flat"]),
  currency: CurrencySchema,
  subaccounts: z
    .array(
      z.object({
        subaccount: z.string(),
        share: z.number(),
      }),
    )
    .check(z.minLength(1)),
  bearer_type: z.enum(["subaccount", "account", "all-proportional", "all"]),
  bearer_subaccount: z.string(),
}) satisfies z.ZodMiniType<CreateSplitPayload>;

export const ListSplitPayloadSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  sort_by: z.optional(z.string()),
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

export const SplitBaseSchema = {
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
};

export const UpdateSplitPayloadSchema = z.discriminatedUnion("bearer_type", [
  z.object({
    ...SplitBaseSchema,
    bearer_type: z.literal("subaccount"),
    bearer_subaccount: z.string(),
  }),
  z.object({
    ...SplitBaseSchema,
    bearer_type: z.optional(z.enum(["account", "all-proportional", "all"])),
    bearer_subaccount: z.optional(z.never()),
  }),
]) satisfies z.ZodMiniType<UpdateSplitPayload>;

export const UpdateSubAccountSplitPayloadSchema = z.object({
  id: z.string(),
  subaccount: z.string(),
  share: z.number(),
}) satisfies z.ZodMiniType<UpdateSubAccountSplitPayload>;
