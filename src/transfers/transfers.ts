import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  InitiateBulkTransferPayloadSchema,
  InitiateTransferPayloadSchema,
  ListTransfersPayloadSchema,
} from "#/transfers/schema";
import type {
  CreateTransferClient,
  FetchTransferResponsePayload,
  FinalizeTransferResponsePayload,
  InitiateBulkTransferPayload,
  InitiateBulkTransferResponsePayload,
  InitiateTransferPayload,
  InitiateTransferResponsePayload,
  ListTransfersPayload,
  ListTransfersResponsePayload,
} from "#/transfers/types";

export const createTransfers = (instance: KyInstance): CreateTransferClient => {
  const initiate = async (payload: InitiateTransferPayload) => {
    const data = InitiateTransferPayloadSchema.parse(payload);
    return await instance
      .post("transfer", {
        json: data,
      })
      .json<InitiateTransferResponsePayload>();
  };

  const finalize = async (payload: { transfer_code: string; otp: string }) => {
    const data = z
      .object({
        transfer_code: z.string(),
        otp: z.string(),
      })
      .parse(payload);
    return await instance
      .post(`transfer/finalize_transfer`, {
        json: data,
      })
      .json<FinalizeTransferResponsePayload>();
  };

  const initiateBulk = async (payload: InitiateBulkTransferPayload) => {
    const data = InitiateBulkTransferPayloadSchema.parse(payload);
    return await instance
      .post("transfer/bulk", {
        json: data,
      })
      .json<InitiateBulkTransferResponsePayload>();
  };

  const list = async (payload: ListTransfersPayload) => {
    const data = ListTransfersPayloadSchema.parse(payload);
    return await instance
      .get("transfer", {
        searchParams: data,
      })
      .json<ListTransfersResponsePayload>();
  };

  const fetch = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`transfer/${data.id_or_code}`)
      .json<FetchTransferResponsePayload>();
  };

  const verify = async (payload: { reference: string }) => {
    const data = z
      .object({
        reference: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`transfer/verify/${data.reference}`)
      .json<FetchTransferResponsePayload>();
  };

  return {
    initiate,
    finalize,
    initiateBulk,
    list,
    fetch,
    verify,
  };
};
