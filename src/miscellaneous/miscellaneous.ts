import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import { ListBanksPayloadSchema } from "#/miscellaneous/schema";
import type {
  CreateMiscellaneousClient,
  ListBanksPayload,
  ListBanksResponsePayload,
  ListCountriesResponsePayload,
} from "#/miscellaneous/types";

export const createMiscellaneous = (
  instance: KyInstance,
): CreateMiscellaneousClient => {
  const listBanks = async (payload: ListBanksPayload) => {
    const data = ListBanksPayloadSchema.parse(payload);
    return await instance
      .get("bank", {
        searchParams: data,
      })
      .json<ListBanksResponsePayload>();
  };

  const listCountries = async () => {
    return await instance.get("country").json<ListCountriesResponsePayload>();
  };

  const listStates = async (payload: { country: number }) => {
    const data = z.object({ country: z.number() }).parse(payload);
    return await instance
      .get("state", {
        searchParams: data,
      })
      .json<{
        status: boolean;
        message: string;
        data: Partial<
          {
            name: string;
            slug: string;
            abbreviation: string;
          }[]
        >;
      }>();
  };

  return {
    listBanks,
    listCountries,
    listStates,
  };
};
