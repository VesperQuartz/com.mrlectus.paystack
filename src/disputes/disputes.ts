import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  AddEvidencePayloadSchema,
  ListDisputesPayloadSchema,
  ResolveDisputePayloadSchema,
  UpdateDisputePayloadSchema,
} from "#/disputes/schema";
import type {
  AddEvidencePayload,
  AddEvidenceResponsePayload,
  CreateDisputeClient,
  FetchDisputeResponsePayload,
  ListDisputesPayload,
  ListDisputesResponsePayload,
  ResolveDisputePayload,
  ResolveDisputeResponsePayload,
  UpdateDisputePayload,
} from "#/disputes/types";

export const createDisputes = (instance: KyInstance): CreateDisputeClient => {
  const list = async (payload: ListDisputesPayload = {}) => {
    const data = ListDisputesPayloadSchema.parse(payload);
    return await instance
      .get("dispute", {
        searchParams: data,
      })
      .json<ListDisputesResponsePayload>();
  };

  const fetch = async (payload: { id: string }) => {
    const data = z.object({ id: z.string() }).parse(payload);
    return await instance
      .get(`dispute/${data.id}`)
      .json<FetchDisputeResponsePayload>();
  };

  const listTranaction = async (payload: { id: string }) => {
    const data = z.object({ id: z.string() }).parse(payload);
    return await instance
      .get(`dispute/transaction/${data.id}`)
      .json<FetchDisputeResponsePayload>();
  };

  const update = async (payload: UpdateDisputePayload) => {
    const data = UpdateDisputePayloadSchema.parse(payload);
    const { id, ...rest } = data;
    return await instance
      .put(`dispute/${data.id}`, {
        json: rest,
      })
      .json<ListDisputesResponsePayload>();
  };

  const addEvidence = async (payload: AddEvidencePayload) => {
    const data = AddEvidencePayloadSchema.parse(payload);
    const { id, ...rest } = data;
    return await instance
      .post(`dispute/${id}/evidence`, {
        json: rest,
      })
      .json<AddEvidenceResponsePayload>();
  };

  const getUploadUrl = async (payload: {
    id: string;
    upload_filename: string;
  }) => {
    const data = z
      .object({ id: z.string(), upload_filename: z.string() })
      .parse(payload);
    const { id, ...rest } = data;
    return await instance
      .get(`dispute/${id}/upload_url`, {
        searchParams: rest,
      })
      .json<{
        status: boolean;
        message: string;
        data: {
          signedUrl: string;
          filename: string;
        };
      }>();
  };

  const resolve = async (payload: ResolveDisputePayload) => {
    const data = ResolveDisputePayloadSchema.parse(payload);
    const { id, ...rest } = data;
    return await instance
      .put(`dispute/${id}/resolve`, {
        json: rest,
      })
      .json<ResolveDisputeResponsePayload>();
  };

  const exports = async (payload: ListDisputesPayload) => {
    const data = ListDisputesPayloadSchema.parse(payload);
    return await instance
      .put(`dispute/export`, {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
        data: {
          path: string;
          expiresAt: string;
        };
      }>();
  };

  return {
    list,
    fetch,
    listTranaction,
    update,
    addEvidence,
    getUploadUrl,
    resolve,
    exports,
  };
};
