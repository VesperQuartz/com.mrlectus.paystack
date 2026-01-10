import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRefunds } from "../src/refunds/refunds";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Refunds", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const refunds = createRefunds(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        transaction: "TRX_12345",
        amount: 5000,
        customer_note: "Product returned",
      };
      const mockResponse = { status: true, message: "Refund initiated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await refunds.create(payload);

      expect(mockKy.post).toHaveBeenCalledWith("refund", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("retry", () => {
    it("should call retry with correct payload", async () => {
      const payload = {
        id: 123,
        refund_account_details: {
          currency: "NGN" as const,
          account_number: "0123456789",
          bank_id: "057",
        },
      };
      const mockResponse = { status: true, message: "Refund retried" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...rest } = payload;
      const result = await refunds.retry(payload);

      expect(mockKy.post).toHaveBeenCalledWith(
        `refund/retry_with_customer_details/${id}`,
        {
          json: rest,
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("list", () => {
    it("should call list with correct search params", async () => {
      const payload = {
        transaction: "TRX_12345",
        currency: "NGN" as const,
        perPage: 10,
        page: 1,
      };
      const mockResponse = { status: true, message: "Refunds retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await refunds.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("refund", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id", async () => {
      const payload = { id: 123 };
      const mockResponse = { status: true, message: "Refund retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await refunds.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`refund/${payload.id}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
