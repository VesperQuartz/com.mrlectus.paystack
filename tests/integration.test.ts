import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createIntegration } from "../src/integration/integration";

// Mock Ky instance
const mockKy = {
  get: vi.fn().mockReturnThis(),
  put: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const integration = createIntegration(mockKy);

  describe("fetchTimeout", () => {
    it("should call fetchTimeout", async () => {
      const mockResponse = {
        status: true,
        message: "Payment session timeout retrieved",
        data: { payment_session_timeout: 30 },
      };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await integration.fetchTimeout();

      expect(mockKy.get).toHaveBeenCalledWith("integration/payment_session_timeout");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateTimeout", () => {
    it("should call updateTimeout with correct payload", async () => {
      const payload = { timeout: 60 };
      const mockResponse = {
        status: true,
        message: "Payment session timeout updated",
        data: { payment_session_timeout: 60 },
      };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await integration.updateTimeout(payload);

      expect(mockKy.put).toHaveBeenCalledWith("integration/payment_session_timeout", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
