import type { z } from "zod/mini";
import type { CurrencySchema } from "./schemas";

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Currency = z.infer<typeof CurrencySchema>;

export type MetaV1 = {
  total: number;
  skipped: number;
  perPage: number;
  page: number;
  pageCount: number;
};

export type Pagination = {
  /**
   * Specify how many records you want to retrieve per page. If not specified, we use a default value of 50.
   */
  perPage?: number;
  /**
   * Specify exactly what page you want to retrieve. If not specified, we use a default value of 1.
   */
  page?: number;
  /**
   * A timestamp from which to start listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  from?: string | Date;
  /**
   * A timestamp at which to stop listing transaction e.g. `2016-09-24T00:00:05.000Z`, `2016-09-21`
   */
  to?: string | Date;
};
