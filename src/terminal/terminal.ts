import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  FetchEventStatusPayloadSchema,
  ListTerminalPayloadSchema,
  SendEventPayloadSchema,
  UpdateTerminalPayloadSchema,
} from "./schema";
import type {
  CreateTerminalClient,
  FetchEventStatusPayload,
  FetchEventStatusResponsePayload,
  FetchStatusResponsePayload,
  FetchTerminalResponsePayload,
  ListTerminalPayload,
  ListTerminalResponsePayload,
  SendEventPayload,
  SendEventResponsePayload,
  UpdateTerminalPayload,
} from "./types";

export const createTerminal = (instance: KyInstance): CreateTerminalClient => {
  const sendEvent = async (payload: SendEventPayload) => {
    const parse = SendEventPayloadSchema.parse(payload);
    const { terminal_id, ...rest } = parse;
    return await instance
      .post(`terminal/${terminal_id}/event`, {
        json: rest,
      })
      .json<SendEventResponsePayload>();
  };

  const fetchEventStatus = async (payload: FetchEventStatusPayload) => {
    const parse = FetchEventStatusPayloadSchema.parse(payload);
    const { terminal_id, event_id } = parse;
    return await instance
      .get(`terminal/${terminal_id}/event/${event_id}`)
      .json<FetchEventStatusResponsePayload>();
  };

  const fetchStatus = async (payload: {
    /** The ID of the Terminal you want to check */
    terminal_id: string;
  }) => {
    const parse = z
      .object({
        terminal_id: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`terminal/${parse.terminal_id}/presence`)
      .json<FetchStatusResponsePayload>();
  };

  const list = async (payload: ListTerminalPayload) => {
    const parse = ListTerminalPayloadSchema.parse(payload);
    return await instance
      .get("terminal", {
        searchParams: parse,
      })
      .json<ListTerminalResponsePayload>();
  };

  const fetch = async (payload: {
    /** The ID of the Terminal the event was sent to. */
    terminal_id: string;
  }) => {
    const parse = z
      .object({
        terminal_id: z.string(),
      })
      .parse(payload);
    return await instance.get(`terminal/${parse.terminal_id}`).json<FetchTerminalResponsePayload>();
  };

  const update = async (payload: UpdateTerminalPayload) => {
    const parse = UpdateTerminalPayloadSchema.parse(payload);
    const { terminal_id, ...rest } = parse;
    return await instance
      .put(`terminal/${terminal_id}`, {
        json: rest,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const commission = async (payload: {
    /** Device Serial Number */
    serial_number: string;
  }) => {
    const parse = z
      .object({
        serial_number: z.string(),
      })
      .parse(payload);
    return await instance
      .post(`terminal/decommission_device`, {
        json: parse,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const decommission = async (payload: {
    /** Device Serial Number */
    serial_number: string;
  }) => {
    const parse = z
      .object({
        serial_number: z.string(),
      })
      .parse(payload);
    return await instance
      .post(`terminal/commission_device`, {
        json: parse,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  return {
    sendEvent,
    fetchEventStatus,
    fetchStatus,
    list,
    fetch,
    update,
    commission,
    decommission,
  };
};
