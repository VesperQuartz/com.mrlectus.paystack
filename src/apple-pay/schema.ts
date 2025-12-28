import { z } from "zod/v4-mini";
import type { ListDomainsPayload } from "./types";

export const ListDomainsPayloadSchema = z.object({
	use_cursor: z.boolean(),
	next: z.optional(z.string()),
	previous: z.optional(z.string()),
}) satisfies z.ZodMiniType<ListDomainsPayload>;
