import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  BulkCreateTransferRecipientPayloadSchema,
  CreateTransferRecipientPayloadSchema,
  ListTransferRecipientsSchema,
  UpdateTransferRecipientPayloadSchema,
} from "#/transfers-recipients/schema";
import type {
  BulkCreateTransferRecipientPayload,
  BulkCreateTransferRecipientResponsePayload,
  CreateTransferRecipientClient,
  CreateTransferRecipientPayload,
  CreateTransferRecipientResponsePayload,
  ListTransferRecipientsPayload,
  ListTransferRecipientsResponsePayload,
  UpdateTransferRecipientPayload,
} from "#/transfers-recipients/types";

export const createTransferRecipients = (
  instance: KyInstance,
): CreateTransferRecipientClient => {
  const create = async (payload: CreateTransferRecipientPayload) => {
    const data = CreateTransferRecipientPayloadSchema.parse(payload);
    return instance
      .post("transferrecipient", {
        json: data,
      })
      .json<CreateTransferRecipientResponsePayload>();
  };

  const bulkCreate = async (payload: BulkCreateTransferRecipientPayload) => {
    const data = BulkCreateTransferRecipientPayloadSchema.parse(payload);
    return instance
      .post("transferrecipient/bulk", {
        json: data,
      })
      .json<BulkCreateTransferRecipientResponsePayload>();
  };

  const list = async (payload: ListTransferRecipientsPayload = {}) => {
    const data = ListTransferRecipientsSchema.parse(payload);
    return instance
      .get("transferrecipient", {
        searchParams: data,
      })
      .json<ListTransferRecipientsResponsePayload>();
  };

  const fetch = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    return instance
      .get(`transferrecipient/${data.id_or_code}`)
      .json<CreateTransferRecipientResponsePayload>();
  };

  const update = async (payload: UpdateTransferRecipientPayload) => {
    const data = UpdateTransferRecipientPayloadSchema.parse(payload);
    const { id_or_code, ...rest } = data;
    return instance
      .put(`transferrecipient/${id_or_code}`, {
        json: rest,
      })
      .json<CreateTransferRecipientResponsePayload>();
  };

  const deleteRecipient = async (payload: { id_or_code: string }) => {
    const data = z
      .object({
        id_or_code: z.string(),
      })
      .parse(payload);
    return instance.delete(`transferrecipient/${data.id_or_code}`).json<{
      status: boolean;
      message: string;
    }>();
  };

  return {
    create,
    bulkCreate,
    list,
    fetch,
    update,
    delete: deleteRecipient,
  };
};
