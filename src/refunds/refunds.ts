import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  CreateRefundPayloadSchema,
  ListRefundsPayloadSchema,
  RetryRefundPayloadSchema,
} from "#/refunds/schema";
import type {
  CreateRefundPayload,
  CreateRefundResponsePauload,
  CreateRefundsClient,
  ListRefundsPayload,
  ListRefundsResponsePayload,
  RetryRefundPayload,
  RetryRefundResponsePayload,
} from "#/refunds/types";

export const createRefunds = (instance: KyInstance): CreateRefundsClient => {
  const create = async (payload: CreateRefundPayload) => {
    const data = CreateRefundPayloadSchema.parse(payload);
    return await instance
      .post("refund", {
        json: data,
      })
      .json<CreateRefundResponsePauload>();
  };

  const retry = async (payload: RetryRefundPayload) => {
    const data = RetryRefundPayloadSchema.parse(payload);
    const { id, ...rest } = data;
    return await instance
      .post(`refund/retry_with_customer_details/${id}`, {
        json: rest,
      })
      .json<RetryRefundResponsePayload>();
  };

  const list = async (payload: ListRefundsPayload) => {
    const data = ListRefundsPayloadSchema.parse(payload);
    return await instance
      .get("refund", {
        searchParams: data,
      })
      .json<ListRefundsResponsePayload>();
  };

  const fetch = async (payload: { id: number }) => {
    const data = z.object({ id: z.number() }).parse(payload);
    return await instance
      .get(`refund/${data.id}`)
      .json<RetryRefundResponsePayload>();
  };

  return {
    create,
    retry,
    list,
    fetch,
  };
};
