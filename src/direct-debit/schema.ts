import { z } from "zod/v4-mini";

export const ListMandateAuthorizationsSchema = z.object({
	cursor: z.optional(z.string()),
	status: z.enum(["active", "revoked", "pending"]),
	per_page: z.optional(z.number()),
});
