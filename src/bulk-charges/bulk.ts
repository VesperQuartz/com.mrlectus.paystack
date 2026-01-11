import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  FetchChargesBatchPayloadSchema,
  InitiateBulkChargePayloadSchema,
  ListBulkChargeBatchesPayloadSchema,
} from "#/bulk-charges/schema";
import type {
  CreateBulkChargeClient,
  FetchBulkChargeBatchResponsePayload,
  FetchChargesBatchPayload,
  FetchChargesBatchResponsePayload,
  InitiateBulkChargePayload,
  InitiateBulkChargeResponsePayload,
  ListBulkChargeBatchesPayload,
  ListBulkChargeBatchesResponsePayload,
} from "#/bulk-charges/types";

export const createBulkCharges = (
  instance: KyInstance,
): CreateBulkChargeClient => {
  const initiate = async (payload: InitiateBulkChargePayload) => {
    const data = InitiateBulkChargePayloadSchema.parse(payload);
    const response = await instance.post("bulkcharge", {
      json: data,
    });
    return response.json<InitiateBulkChargeResponsePayload>();
  };

  const listBatches = async (payload: ListBulkChargeBatchesPayload = {}) => {
    const data = ListBulkChargeBatchesPayloadSchema.parse(payload);
    const response = await instance.get("bulkcharge", {
      searchParams: data,
    });
    return response.json<ListBulkChargeBatchesResponsePayload>();
  };

  const fetch = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    const response = await instance.get(`bulkcharge/${data.id_or_code}`);
    return response.json<FetchBulkChargeBatchResponsePayload>();
  };

  const fetchBatch = async (payload: FetchChargesBatchPayload) => {
    const data = FetchChargesBatchPayloadSchema.parse(payload);
    const { id_or_code, ...rest } = data;
    const response = await instance.get(`bulkcharge/${id_or_code}/charges`, {
      searchParams: rest,
    });
    return response.json<FetchChargesBatchResponsePayload>();
  };

  const pauseBatch = async (payload: { batch_code: string }) => {
    const data = z
      .object({
        batch_code: z.string(),
      })
      .parse(payload);
    const response = await instance.get(`bulkcharge/pause/${data.batch_code}`);
    return response.json<{
      status: boolean;
      message: string;
    }>();
  };

  const resumeBatch = async (payload: { batch_code: string }) => {
    const data = z
      .object({
        batch_code: z.string(),
      })
      .parse(payload);
    const response = await instance.get(`bulkcharge/resume/${data.batch_code}`);
    return response.json<{
      status: boolean;
      message: string;
    }>();
  };

  return {
    initiate,
    listBatches,
    fetch,
    fetchBatch,
    pauseBatch,
    resumeBatch,
  };
};
