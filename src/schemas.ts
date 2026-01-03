import { z } from "zod/v4-mini";

export const CurrencySchema = z.enum(["NGN", "GHS", "USD", "ZAR", "KES", "XOF"]);
