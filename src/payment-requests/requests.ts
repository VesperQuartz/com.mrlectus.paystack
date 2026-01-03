import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  CreatePaymentRequestPayloadSchema,
  ListPaymentRequestPayloadSchema,
  UpdatePaymentRequestPayloadSchema,
} from "#/payment-requests/schema";
import type {
  CreatePaymentRequestClient,
  CreatePaymentRequestPayload,
  CreatePaymentRequestResponsePayload,
  FetchPaymentRequestResponsePayload,
  ListPaymentRequestPayload,
  ListPaymentRequestResponsePayload,
  PaymentReuestTotalResponsePayload,
  UpdatePaymentRequestPayload,
  VerifyPaymentRequestResponsePayload,
} from "#/payment-requests/types";

export const createPaymentRequests = (instance: KyInstance): CreatePaymentRequestClient => {
  const create = async (payload: CreatePaymentRequestPayload) => {
    const data = CreatePaymentRequestPayloadSchema.parse(payload);
    return await instance
      .post("paymentrequest", {
        json: data,
      })
      .json<CreatePaymentRequestResponsePayload>();
  };

  const list = async (payload: ListPaymentRequestPayload) => {
    const data = ListPaymentRequestPayloadSchema.parse(payload);
    return await instance
      .get("paymentrequest", {
        searchParams: data,
      })
      .json<ListPaymentRequestResponsePayload>();
  };

  const fetch = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`paymentrequest/${data.id_or_code}`)
      .json<FetchPaymentRequestResponsePayload>();
  };

  const verify = async (payload: { code: string }) => {
    const data = z
      .object({
        code: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`paymentrequest/verify/${data.code}`)
      .json<VerifyPaymentRequestResponsePayload>();
  };

  const sendNotification = async (payload: { code: string }) => {
    const data = z
      .object({
        code: z.string(),
      })
      .parse(payload);
    return await instance.post(`paymentrequest/notify/${data.code}`).json<{
      status: boolean;
      message: string;
    }>();
  };

  const totals = async () => {
    return await instance.get("paymentrequest/totals").json<PaymentReuestTotalResponsePayload>();
  };

  const finalize = async (payload: { code: string; send_notification?: boolean }) => {
    const data = z
      .object({
        code: z.string(),
        send_notification: z.optional(z.boolean()),
      })
      .parse(payload);
    const { code, ...rest } = data;
    return await instance
      .post(`paymentrequest/finalize/${code}`, {
        json: rest,
      })
      .json<CreatePaymentRequestResponsePayload>();
  };

  const update = async (payload: UpdatePaymentRequestPayload) => {
    const data = UpdatePaymentRequestPayloadSchema.parse(payload);
    const { id_or_code, ...rest } = data;
    return await instance
      .put(`paymentrequest/${id_or_code}`, {
        json: rest,
      })
      .json<CreatePaymentRequestResponsePayload>();
  };

  const archive = async (payload: { code: string }) => {
    const data = z
      .object({
        code: z.string(),
      })
      .parse(payload);
    return await instance.post(`paymentrequest/archive/${data.code}`).json<{
      status: boolean;
      message: string;
    }>();
  };

  return {
    create,
    list,
    fetch,
    verify,
    sendNotification,
    totals,
    finalize,
    update,
    archive,
  };
};
