import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSettlements } from "../src/settlements/settlements";

// Mock Ky instance
const mockKy = {
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Settlements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const settlements = createSettlements(mockKy);

  describe("list", () => {
    it("should call list with correct search params", async () => {
      const payload = {
        perPage: 10,
        page: 1,
        status: "success" as const,
      };
      const mockResponse = { status: true, message: "Settlements retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await settlements.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("settlement", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listTransactions", () => {
    it("should call listTransactions with correct id and search params", async () => {
      const payload = {
        id: "SET_123",
        perPage: 10,
        page: 1,
      };
      const mockResponse = {
        status: true,
        message: "Settlement transactions retrieved",
      };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...rest } = payload;
      const result = await settlements.listTransactions(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`settlement/${id}/transactions`, {
        searchParams: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
