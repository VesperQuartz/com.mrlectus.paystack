import type { z } from "zod/mini";
import type { CurrencySchema } from "./schemas";

export type Nullable<T> = {
	[P in keyof T]: T[P] | null;
};

export type Currency = z.infer<typeof CurrencySchema>;
