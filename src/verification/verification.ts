import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import { ValidateAccountPayloadSchema } from "#/verification/schema";
import type {
  CreateVerificationClient,
  ValidateAccountPayload,
  ValidateAccountResponsePayload,
} from "#/verification/types";

export const createVerification = (
  instance: KyInstance,
): CreateVerificationClient => {
  const resolveAccount = async (payload: {
    account_number: string;
    bank_code: string;
  }) => {
    const data = z
      .object({
        account_number: z.string(),
        bank_code: z.string(),
      })
      .parse(payload);
    return await instance
      .get("resolve", {
        searchParams: data,
      })
      .json<{
        status: boolean;
        message: string;
        data: {
          account_number: string;
          account_name: string;
        };
      }>();
  };

  const validateAccount = async (payload: ValidateAccountPayload) => {
    const data = ValidateAccountPayloadSchema.parse(payload);
    return await instance
      .post("bank/validate", {
        json: data,
      })
      .json<ValidateAccountResponsePayload>();
  };

  const resolveCardBIN = async (payload: { bin: string }) => {
    const data = z
      .object({ bin: z.string().check(z.length(6)) })
      .parse(payload);

    return await instance.get(`decision/bin/${data.bin}`).json<{
      status: boolean;
      message: string;
      data: {
        bin: string;
        brand: string;
        sub_brand: string;
        country_code: string;
        country_name: string;
        card_type: string;
        bank: string;
        linked_bank_id: number;
      };
    }>();
  };

  return {
    resolveAccount,
    validateAccount,
    resolveCardBIN,
  };
};
