import { z } from "zod/v4-mini";
import { CurrencySchema } from "../schemas";
import type {
  AddSplitCodePayload,
  AssignDestinationPayload,
  CreateVirtualTerminalPayload,
  ListVirtualTerminalPayload,
  UnAssignDestinationPayload,
} from "./types";

export const CreateVirtualTerminalSchemaPayload = z.object({
  name: z.string(),
  destinations: z.array(
    z.object({
      target: z.string(),
      name: z.string(),
    }),
  ),
  currency: z.optional(z.array(CurrencySchema)),
  custom_fields: z.array(
    z.object({
      display_name: z.string(),
      variable_name: z.string(),
    }),
  ),
  metadata: z.array(z.string()),
}) satisfies z.ZodMiniType<CreateVirtualTerminalPayload>;

export const ListVirtualTerminalPayloadSchema = z.object({
  status: z.enum(["active", "inactive"]),
  perPage: z.optional(z.number()),
  search: z.optional(z.string()),
  next: z.optional(z.string()),
  previous: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListVirtualTerminalPayload>;

export const AssignDestinationPayloadSchema = z.object({
  code: z.string(),
  destinations: z.array(
    z.object({
      target: z.string(),
      name: z.string(),
    }),
  ),
}) satisfies z.ZodMiniType<AssignDestinationPayload>;

export const UnAssignDestinationPayloadSchema = z.object({
  code: z.string(),
  targets: z.array(z.string()),
}) satisfies z.ZodMiniType<UnAssignDestinationPayload>;

export const AddSplitCodePayloadSchema = z.object({
  code: z.string(),
  split_code: z.string(),
}) satisfies z.ZodMiniType<AddSplitCodePayload>;
