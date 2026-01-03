import type { KyInstance } from "ky";
import z from "zod";
import {
  AssignDedicatedVirtualAccountSchemaPayload,
  CreateDedicatedVirtualAccountSchemaPayload,
  ListDedicatedVirtualAccountsSchemaPayload,
  RequeryDedicatedAccountSchemaPayload,
  SplitDedicatedAccountTransactionSchemaPayload,
} from "./schema";
import type {
  AssignDedicatedVirtualAccountPayload,
  CreateDedicatedAccountClient,
  CreateDedicatedVirtualAccountPayload,
  CreateDedicatedVirtualAccountResponsePayload,
  DeactivateDedicatedAccountResponsePayload,
  FetchBankProvidersResponsePayload,
  FetchDedicatedVirtualAccountResponsePayload,
  ListDedicatedVirtualAccountsPayload,
  ListDedicatedVirtualAccountsResponsePayload,
  RequeryDedicatedAccountPayload,
  SplitDedicatedAccountTransactionPayload,
  SplitDedicatedAccountTransactionResponsePayload,
} from "./types";

export const createDedicatedVirtualAccounts = (
  instance: KyInstance,
): CreateDedicatedAccountClient => {
  const create = async (payload: CreateDedicatedVirtualAccountPayload) => {
    const data = CreateDedicatedVirtualAccountSchemaPayload.parse(payload);
    return await instance
      .post("dedicated_account", {
        json: data,
      })
      .json<CreateDedicatedVirtualAccountResponsePayload>();
  };

  const assign = async (payload: AssignDedicatedVirtualAccountPayload) => {
    const data = AssignDedicatedVirtualAccountSchemaPayload.parse(payload);
    return await instance
      .put(`dedicated_account/assign`, {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const list = async (payload: ListDedicatedVirtualAccountsPayload) => {
    const data = ListDedicatedVirtualAccountsSchemaPayload.parse(payload);
    return await instance
      .get("dedicated_account", {
        searchParams: data,
      })
      .json<ListDedicatedVirtualAccountsResponsePayload>();
  };

  const fetch = async (payload: { dedicated_account_id: number }) => {
    const data = z
      .object({
        dedicated_account_id: z.number(),
      })
      .parse(payload);
    return await instance
      .get(`dedicated_account/${data.dedicated_account_id}`)
      .json<FetchDedicatedVirtualAccountResponsePayload>();
  };

  const requery = async (payload: RequeryDedicatedAccountPayload) => {
    const data = RequeryDedicatedAccountSchemaPayload.parse(payload);
    return await instance
      .get(`dedicated_account/requery`, {
        searchParams: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const deactivate = async (payload: { dedicated_account_id: number }) => {
    const data = z
      .object({
        dedicated_account_id: z.number(),
      })
      .parse(payload);
    return await instance
      .delete(`dedicated_account/${data.dedicated_account_id}`)
      .json<DeactivateDedicatedAccountResponsePayload>();
  };

  const splitTransaction = async (payload: SplitDedicatedAccountTransactionPayload) => {
    const data = SplitDedicatedAccountTransactionSchemaPayload.parse(payload);
    return await instance
      .post(`dedicated_account/split`, {
        json: data,
      })
      .json<SplitDedicatedAccountTransactionResponsePayload>();
  };

  const listBankProviders = async () => {
    return await instance
      .get("dedicated_account/available_providers")
      .json<FetchBankProvidersResponsePayload>();
  };

  const removeSplit = async (payload: { account_number: string }) => {
    const data = z
      .object({
        account_number: z.string(),
      })
      .parse(payload);
    return await instance
      .delete(`dedicated_account/split`, {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  return {
    create,
    assign,
    list,
    fetch,
    requery,
    deactivate,
    splitTransaction,
    removeSplit,
    listBankProviders,
  };
};
