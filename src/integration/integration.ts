import type { KyInstance } from "ky";
import { z } from "zod/v4-mini";
import type { CreateIntegrationClient } from "#/integration";

export const createIntegration = (
  instance: KyInstance,
): CreateIntegrationClient => {
  const fetchTimeout = async () => {
    return await instance.get("integration/payment_session_timeout").json<{
      status: boolean;
      message: string;
      data: {
        payment_session_timeout: number;
      };
    }>();
  };

  const updateTimeout = async (payload: { timeout: number }) => {
    const data = z
      .object({
        timeout: z.number(),
      })
      .parse(payload);
    const response = await instance.put("integration/payment_session_timeout", {
      json: data,
    });
    return response.json<{
      status: boolean;
      message: string;
      data: {
        payment_session_timeout: number;
      };
    }>();
  };

  return {
    fetchTimeout,
    updateTimeout,
  };
};
