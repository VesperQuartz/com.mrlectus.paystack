import type { KyInstance } from "ky";
import z from "zod";
import {
  CreateSubaccountPayloadSchema,
  ListSubAccountsPayloadSchema,
  UpdateSubAccountPayloadSchema,
} from "./schema";
import type {
  CreateSubaccountClient,
  CreateSubaccountPayload,
  CreateSubaccountResponsePayload,
  FetchSubAccountResponsePayload,
  ListSubAccountsPayload,
  ListSubAccountsResponsePayload,
  UpdateSubAccountPayload,
} from "./types";

export const createSubaccounts = (instance: KyInstance): CreateSubaccountClient => {
  const create = async (payload: CreateSubaccountPayload) => {
    const data = CreateSubaccountPayloadSchema.parse(payload);
    return await instance
      .post("subaccount", {
        json: data,
      })
      .json<CreateSubaccountResponsePayload>();
  };

  const list = async (payload: ListSubAccountsPayload) => {
    const data = ListSubAccountsPayloadSchema.parse(payload);
    return await instance
      .get("subaccount", {
        searchParams: data,
      })
      .json<ListSubAccountsResponsePayload>();
  };

  const fetch = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`subaccount/${data.id_or_code}`)
      .json<FetchSubAccountResponsePayload>();
  };

  const update = async (payload: UpdateSubAccountPayload) => {
    const data = UpdateSubAccountPayloadSchema.parse(payload);
    const { id_or_code, ...rest } = data;
    return await instance
      .put(`subaccount/${id_or_code}`, {
        json: rest,
      })
      .json<FetchSubAccountResponsePayload>();
  };

  return {
    create,
    list,
    fetch,
    update,
  };
};
