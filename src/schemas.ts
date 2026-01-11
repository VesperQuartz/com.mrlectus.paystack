import { z } from "zod/v4-mini";

export const CurrencySchema = z.enum([
  "NGN",
  "GHS",
  "USD",
  "ZAR",
  "KES",
  "XOF",
]);

export const PaginationSchema = z.object({
  perPage: z.optional(z.int().check(z.positive())),
  page: z.optional(z.int().check(z.positive())),
  from: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
  to: z.pipe(
    z.optional(z.coerce.date()),
    z.transform((date) => date?.toISOString()),
  ),
});
