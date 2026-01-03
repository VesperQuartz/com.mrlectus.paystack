import { z } from "zod/v4-mini";
import type {
  FetchEventStatusPayload,
  ListTerminalPayload,
  SendEventPayload,
  UpdateTerminalPayload,
} from "./types";

export const SendEventPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    terminal_id: z.string(),
    type: z.literal("invoice"),
    action: z.union([z.literal("process"), z.literal("view")]),
    data: z.object({
      id: z.number(),
      reference: z.number(),
    }),
  }),
  z.object({
    terminal_id: z.string(),
    type: z.literal("transaction"),
    action: z.union([z.literal("process"), z.literal("print")]),
    data: z.object({
      id: z.number(),
    }),
  }),
]) satisfies z.ZodMiniType<SendEventPayload>;

export const FetchEventStatusPayloadSchema = z.object({
  terminal_id: z.string(),
  event_id: z.string(),
}) satisfies z.ZodMiniType<FetchEventStatusPayload>;

export const ListTerminalPayloadSchema = z.object({
  status: z.enum(["active", "inactive"]),
  search: z.optional(z.string()),
  next: z.optional(z.string()),
  perPage: z.optional(z.number()),
  previous: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListTerminalPayload>;

export const UpdateTerminalPayloadSchema = z.object({
  terminal_id: z.string(),
  name: z.string(),
  address: z.string(),
}) satisfies z.ZodMiniType<UpdateTerminalPayload>;
