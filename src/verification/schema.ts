import { z } from "zod/v4-mini";
import type { ValidateAccountPayload } from "#/verification/types";

export const ValidateAccountPayloadSchema = z.object({
  account_name: z.string(),
  account_number: z.string().check(z.length(10)),
  account_type: z.enum(["personal", "business"]),
  bank_code: z.string().check(z.length(3)),
  country_code: z.string(),
  document_type: z.enum([
    "identityNumber",
    "passportNumber",
    "businessRegistrationNumber",
  ]),
  document_number: z.string(),
}) satisfies z.ZodMiniType<ValidateAccountPayload>;
