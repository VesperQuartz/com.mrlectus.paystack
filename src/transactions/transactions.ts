import type { KyInstance } from "ky";
import {
  ChargeAuthorizationPayloadSchema,
  ExportTransactionPayloadSchema,
  InitializePayloadSchema,
  ListPayloadSchema,
  PartialDebitPayloadSchema,
  TransactionTotalPayloadSchema,
} from "./schema";
import type {
  ChargeAuthorizationPayload,
  ExportTransactionPayload,
  ExportTransactionResponsePayload,
  InitializePayload,
  InitializePayloadResponse,
  ListPayload,
  ListResponsePayload,
  PartialDebitPayload,
  PartialDebitResponsePayload,
  TransactionsClient,
  TransactionTotalPayload,
  TransactionTotalResponsePayload,
  VerifyPayload,
  VerifyResponsePayload,
  ViewTimelineResponsePayload,
} from "./types";

export const createTransactions = (instance: KyInstance): TransactionsClient => {
  const initialize = async (payload: InitializePayload) => {
    const data = InitializePayloadSchema.parse(payload);
    return await instance
      .post("transaction/initialize", {
        json: data,
      })
      .json<InitializePayloadResponse>();
  };

  const verify = async (payload: VerifyPayload) => {
    return await instance
      .get(`transaction/verify/${payload.reference}`)
      .json<VerifyResponsePayload>();
  };

  const list = async (payload: ListPayload = {}) => {
    const params = ListPayloadSchema.parse(payload);
    return await instance
      .get("transaction", {
        searchParams: params,
      })
      .json<ListResponsePayload>();
  };

  const fetch = async (payload: { id: number }) => {
    return instance.get(`transaction/${payload.id}`).json<VerifyResponsePayload>();
  };

  const chargeAuthorization = async (payload: ChargeAuthorizationPayload) => {
    const data = ChargeAuthorizationPayloadSchema.parse(payload);
    return await instance
      .post("transaction/charge_authorization", {
        json: data,
      })
      .json<VerifyResponsePayload>();
  };

  const viewTimeline = async (payload: { id_or_reference: string }) => {
    return await instance
      .get(`transaction/timeline/${payload.id_or_reference}`)
      .json<ViewTimelineResponsePayload>();
  };

  const transactionTotals = async (payload: TransactionTotalPayload = {}) => {
    const data = TransactionTotalPayloadSchema.parse(payload);
    return await instance
      .get("transaction/totals", {
        searchParams: data,
      })
      .json<TransactionTotalResponsePayload>();
  };

  const exportTransaction = async (payload: ExportTransactionPayload = {}) => {
    const data = ExportTransactionPayloadSchema.parse(payload);
    return await instance
      .get("transaction/export", {
        searchParams: data,
      })
      .json<ExportTransactionResponsePayload>();
  };

  const partialDebit = async (payload: PartialDebitPayload) => {
    const data = PartialDebitPayloadSchema.parse(payload);
    return await instance
      .post("transaction/partial_debit", {
        json: data,
      })
      .json<PartialDebitResponsePayload>();
  };

  return {
    initialize,
    verify,
    list,
    fetch,
    chargeAuthorization,
    viewTimeline,
    transactionTotals,
    exportTransaction,
    partialDebit,
  };
};
