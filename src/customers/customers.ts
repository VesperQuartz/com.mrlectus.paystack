import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import {
  CreateCustomerSchemaPayload,
  InitializeAuthorizationPayloadSchema,
  InitializeDirectDebitPayloadSchema,
  ListCustomerPayloadSchema,
  SetRiskActionPayloadSchema,
  UpdateCustomerPayloadSchema,
  ValidateCustomerPayloadSchema,
} from "./schema";
import type {
  CreateCustomerClient,
  CreateCustomerPayload,
  CreateCustomerResponsePayload,
  FetchCustomerResponsePayload,
  FetchMandateAuthorizationsResponsePayload,
  InitializeAuthorizationPayload,
  InitializeAuthorizationResponsePayload,
  InitializeDirectDebitPayload,
  ListCustomerPayload,
  ListCustomerResponsePayload,
  SetRiskActionPayload,
  SetRiskActionResponsePayload,
  UpdateCustomerPayload,
  UpdateCustomerResponsePayload,
  ValidateCustomerPayload,
  VerifyAuthorizationResponsePayload,
} from "./types";

export const createCustomer = (instance: KyInstance): CreateCustomerClient => {
  const create = async (payload: CreateCustomerPayload) => {
    const data = CreateCustomerSchemaPayload.parse(payload);
    return await instance
      .post("customer", {
        json: data,
      })
      .json<CreateCustomerResponsePayload>();
  };

  const list = async (payload: ListCustomerPayload = {}) => {
    const data = ListCustomerPayloadSchema.parse(payload);
    return await instance
      .get("customer", {
        searchParams: data,
      })
      .json<ListCustomerResponsePayload>();
  };

  const fetch = async (payload: { email_or_code: string }) => {
    const data = z
      .object({
        email_or_code: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`customer/${data.email_or_code}`, {
        searchParams: data,
      })
      .json<FetchCustomerResponsePayload>();
  };

  const update = async (payload: UpdateCustomerPayload) => {
    const parse = UpdateCustomerPayloadSchema.parse(payload);
    const { code, ...rest } = parse;
    return await instance
      .put(`customer/${code}`, {
        json: rest,
      })
      .json<UpdateCustomerResponsePayload>();
  };

  const validate = async (payload: ValidateCustomerPayload) => {
    const parse = ValidateCustomerPayloadSchema.parse(payload);
    const { code, ...rest } = parse;
    return await instance
      .post(`customer/${code}/identification`, {
        json: rest,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const setRiskAction = async (payload: SetRiskActionPayload) => {
    const data = SetRiskActionPayloadSchema.parse(payload);
    return await instance
      .put(`customer/set_risk_action`, {
        json: data,
      })
      .json<SetRiskActionResponsePayload>();
  };

  const initializeAuthorization = async (payload: InitializeAuthorizationPayload) => {
    const data = InitializeAuthorizationPayloadSchema.parse(payload);
    return await instance
      .post(`customer/authorization/initialize`, {
        json: data,
      })
      .json<InitializeAuthorizationResponsePayload>();
  };

  const verifyAuthorization = async (payload: { reference: string }) => {
    const parse = z
      .object({
        reference: z.string(),
      })
      .parse(payload);
    return await instance
      .get(`customer/authorization/verify/${parse.reference}`)
      .json<VerifyAuthorizationResponsePayload>();
  };

  const initializeDirectDebit = async (payload: InitializeDirectDebitPayload) => {
    const parse = InitializeDirectDebitPayloadSchema.parse(payload);
    const { id, ...rest } = parse;
    return await instance
      .post(`customer/${id}/initialize-direct-debit`, {
        json: rest,
      })
      .json<InitializeAuthorizationResponsePayload>();
  };

  const directDebitActivationCharge = async (payload: { id: number; authorization_id: number }) => {
    const parse = z
      .object({
        id: z.number(),
        authorization_id: z.number(),
      })
      .parse(payload);
    const { id, ...rest } = parse;
    return await instance
      .put(`customer/authorization/${id}/direct-debit-activation-charge`, {
        json: rest,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const fetchMandateAuthorizations = async (payload: { id: number }) => {
    const data = z
      .object({
        id: z.number(),
      })
      .parse(payload);
    return await instance
      .get(`customer/${data.id}/directdebit-mandate-authorizations`)
      .json<FetchMandateAuthorizationsResponsePayload>();
  };

  const deactivateAuthorization = async (payload: { authorization_code: string }) => {
    const data = z
      .object({
        authorization_code: z.templateLiteral([`AUTH_`, z.string()]),
      })
      .parse(payload);
    return await instance
      .post(`customer/authorization/deactivate`, {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  return {
    create,
    list,
    fetch,
    update,
    validate,
    setRiskAction,
    initializeAuthorization,
    verifyAuthorization,
    initializeDirectDebit,
    directDebitActivationCharge,
    fetchMandateAuthorizations,
    deactivateAuthorization,
  };
};
