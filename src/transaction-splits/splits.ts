import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  createSplitPayloadSchema,
  ListSplitPayloadSchema,
  UpdateSplitPayloadSchema,
  UpdateSubAccountSplitPayloadSchema,
} from "./schema";
import type {
  CreateSplitPayload,
  ListSplitPayload,
  ListSplitResponsePayload,
  SplitResponsePayload,
  TransactionSplitsClient,
  UpdateSplitPayload,
  UpdateSubAccountSplitPayload,
} from "./types";

export const createTransactionSplits = (instance: KyInstance): TransactionSplitsClient => {
  const create = async (payload: CreateSplitPayload) => {
    const data = createSplitPayloadSchema.parse(payload);
    return await instance
      .post("split", {
        json: data,
      })
      .json<SplitResponsePayload>();
  };

  const list = async (payload: ListSplitPayload) => {
    const data = ListSplitPayloadSchema.parse(payload);
    return await instance
      .get("split", {
        searchParams: data,
      })
      .json<ListSplitResponsePayload>();
  };

  const fetch = async (payload: { id: string }) => {
    const data = z
      .object({
        id: z.string(),
      })
      .parse(payload);
    return await instance.get(`split/${data.id}`).json<SplitResponsePayload>();
  };

  const update = async (payload: UpdateSplitPayload) => {
    const parse = UpdateSplitPayloadSchema.parse(payload);
    const { id, ...data } = parse;
    return await instance
      .put(`split/${id}`, {
        json: data,
      })
      .json<SplitResponsePayload>();
  };

  const updateSubaccount = async (payload: UpdateSubAccountSplitPayload) => {
    const parse = UpdateSubAccountSplitPayloadSchema.parse(payload);
    const { id, ...data } = parse;
    return await instance
      .post(`split/${id}/subaccount/add`, {
        json: data,
      })
      .json<SplitResponsePayload>();
  };

  const removeSubaccount = async (payload: UpdateSubAccountSplitPayload) => {
    const parse = z
      .omit(UpdateSubAccountSplitPayloadSchema, {
        share: true,
      })
      .parse(payload);
    const { id, ...data } = parse;
    return await instance
      .post(`split/${id}/subaccount/remove`, {
        json: data,
      })
      .json<Omit<SplitResponsePayload, "data">>();
  };

  return {
    create,
    list,
    fetch,
    update,
    updateSubaccount,
    removeSubaccount,
  };
};
