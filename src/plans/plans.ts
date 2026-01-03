import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  CreatePlanSchemaPayloadSchema,
  ListPlansPayloadSchema,
  UpdatePlanPayloadSchema,
} from "./schema";
import type {
  CreatePlanClient,
  CreatePlanPayload,
  CreatePlanResponsePayload,
  FetchPlansResponsePayload,
  ListPlansPayload,
  ListPlansResponsePayload,
  UpdatePlanPayload,
} from "./types";

export const createPlans = (instance: KyInstance): CreatePlanClient => {
  const create = async (payload: CreatePlanPayload) => {
    const data = CreatePlanSchemaPayloadSchema.parse(payload);
    return await instance
      .post("plan", {
        json: data,
      })
      .json<CreatePlanResponsePayload>();
  };

  const list = async (payload: ListPlansPayload) => {
    const data = ListPlansPayloadSchema.parse(payload);
    return await instance
      .get("plan", {
        searchParams: data,
      })
      .json<ListPlansResponsePayload>();
  };

  const fetch = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    return await instance.get(`plan/${data.id_or_code}`).json<FetchPlansResponsePayload>();
  };

  const update = async (payload: UpdatePlanPayload) => {
    const data = UpdatePlanPayloadSchema.parse(payload);
    const { id_or_code, ...rest } = data;
    return await instance
      .put(`plan/${id_or_code}`, {
        json: rest,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  return {
    create,
    list,
    fetch,
    update,
  };
};
