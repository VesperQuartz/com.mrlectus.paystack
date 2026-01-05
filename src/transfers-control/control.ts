import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import type {
  CreateTransferControlClient,
  FetchBalanceLedgerResponsePayload,
} from "#/transfers-control/types";
import type { Currency } from "#/types";

export const createTransfersControl = (
  instance: KyInstance,
): CreateTransferControlClient => {
  const checkBalance = async () => {
    return await instance.get("balance").json<{
      status: boolean;
      message: string;
      data: Partial<
        {
          currency: Currency;
          balance: number;
        }[]
      >;
    }>();
  };

  const fetchBalanceLedger = async () => {
    return await instance
      .get("balance/ledger")
      .json<FetchBalanceLedgerResponsePayload>();
  };

  const resendOTP = async (payload: {
    transfer_code: string;
    reason: string;
  }) => {
    const data = z
      .object({
        transfer_code: z.string(),
        reason: z.string(),
      })
      .parse(payload);
    return await instance
      .post("transfer/resend_otp", {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const disableOTP = async () => {
    return await instance
      .post("transfer/disable_otp", {
        json: {},
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const finalizeDisableOTP = async (payload: { otp: string }) => {
    const data = z
      .object({
        otp: z.string(),
      })
      .parse(payload);
    return await instance
      .post("transfer/disable_otp_finalize", {
        json: data,
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  const enableOTP = async () => {
    return await instance
      .post("transfer/enable_otp", {
        json: {},
      })
      .json<{
        status: boolean;
        message: string;
      }>();
  };

  return {
    checkBalance,
    fetchBalanceLedger,
    resendOTP,
    disableOTP,
    finalizeDisableOTP,
    enableOTP,
  };
};
