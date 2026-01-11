import type { z } from "zod/v4-mini";
import type { EventDataSchema } from "#/webhook/schema";

export type WebhookEventData = z.infer<typeof EventDataSchema>;
