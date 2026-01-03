import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import { ListDomainsPayloadSchema } from "./schema";
import type { CreateApplePayClient, ListDomainsPayload, ListDomainsResponsePayload } from "./types";

export const createApplePay = (instance: KyInstance): CreateApplePayClient => {
  const registerDomain = async (payload: { domainName: string }) => {
    const data = z
      .object({
        domainName: z.string(),
      })
      .parse(payload);
    return await instance
      .post("apple-pay/domain", {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const listDomains = async (payload: ListDomainsPayload) => {
    const data = ListDomainsPayloadSchema.parse(payload);
    return await instance
      .get("apple-pay/domain", {
        searchParams: data,
      })
      .json<ListDomainsResponsePayload>();
  };

  const unregisterDomain = async (payload: { domainName: string }) => {
    const data = z
      .object({
        domainName: z.string(),
      })
      .parse(payload);
    return await instance
      .delete(`apple-pay/domain`, {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  return {
    registerDomain,
    listDomains,
    unregisterDomain,
  };
};
