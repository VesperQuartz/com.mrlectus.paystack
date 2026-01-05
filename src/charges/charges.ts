import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  CreateChargePayloadSchema,
  SubmitAddressPayloadSchema,
} from "#/charges/schema";
import type {
  CreateChargeClient,
  CreateChargePayload,
  CreateChargeResponsePayload,
  SubmitAddressPayload,
  SubmitPinResponsePayload,
} from "#/charges/types";

export const createCharges = (instance: KyInstance): CreateChargeClient => {
  const create = async (payload: CreateChargePayload) => {
    const data = CreateChargePayloadSchema.parse(payload);
    const response = await instance.post("charge", {
      json: data,
    });
    return response.json<CreateChargeResponsePayload>();
  };

  const submitPin = async (payload: { reference: string; pin: string }) => {
    const data = z
      .object({
        reference: z.string(),
        pin: z.string(),
      })
      .parse(payload);
    const response = await instance.post("charge/submit_pin", {
      json: data,
    });
    return response.json<SubmitPinResponsePayload>();
  };

  const submitOtp = async (payload: { reference: string; otp: string }) => {
    const data = z
      .object({
        reference: z.string(),
        otp: z.string(),
      })
      .parse(payload);
    const response = await instance.post("charge/submit_otp", {
      json: data,
    });
    return response.json<SubmitPinResponsePayload>();
  };

  const submitPhone = async (payload: { reference: string; phone: string }) => {
    const data = z
      .object({
        reference: z.string(),
        phone: z.string(),
      })
      .parse(payload);
    const response = await instance.post("charge/submit_phone", {
      json: data,
    });
    return response.json<SubmitPinResponsePayload>();
  };

  const submitBirthday = async (payload: {
    reference: string;
    birthday: string;
  }) => {
    const data = z
      .object({
        reference: z.string(),
        birthday: z.pipe(
          z.optional(z.coerce.date()),
          z.transform((date) => date?.toISOString()),
        ),
      })
      .parse(payload);
    const response = await instance.post("charge/submit_birthday", {
      json: data,
    });
    return response.json<SubmitPinResponsePayload>();
  };

  const submitAddress = async (payload: SubmitAddressPayload) => {
    const data = SubmitAddressPayloadSchema.parse(payload);
    const response = await instance.post("charge/submit_address", {
      json: data,
    });
    return response.json<SubmitPinResponsePayload>();
  };

  const checkPending = async (payload: { reference: string }) => {
    const data = z
      .object({
        reference: z.string(),
      })
      .parse(payload);
    const response = await instance.get(`charge/${data.reference}`);
    return response.json<SubmitPinResponsePayload>();
  };

  return {
    create,
    submitPin,
    submitOtp,
    submitPhone,
    submitBirthday,
    submitAddress,
    checkPending,
  };
};
