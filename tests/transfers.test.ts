import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransfers } from "../src/transfers/transfers";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Transfers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const transfers = createTransfers(mockKy);

  describe("initiate", () => {
    it("should call initiate with correct payload", async () => {
      const payload = {
        source: "balance" as const,
        amount: 5000,
        recipient: "RCP_12345",
        reference: "ref-1234567890123456",
      };
      const mockResponse = { status: true, message: "Transfer initiated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfers.initiate(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transfer", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("finalize", () => {
    it("should call finalize with correct payload", async () => {
      const payload = {
        transfer_code: "TRF_12345",
        otp: "123456",
      };
      const mockResponse = { status: true, message: "Transfer finalized" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfers.finalize(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transfer/finalize_transfer", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("initiateBulk", () => {
    it("should call initiateBulk with correct payload", async () => {
      const payload = {
        source: "balance" as const,
        transfers: [
          {
            source: "balance" as const,
            amount: 5000,
            recipient: "RCP_12345",
            reference: "ref-1234567890123456",
          },
        ],
      };
      const mockResponse = { status: true, message: "Bulk transfer initiated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfers.initiateBulk(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transfer/bulk", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("list", () => {
    it("should call list with correct search params", async () => {
      const payload = {
        perPage: 10,
        page: 1,
        recipient: 123,
      };
      const mockResponse = { status: true, message: "Transfers retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfers.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("transfer", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id_or_code", async () => {
      const payload = { id_or_code: "TRF_12345" };
      const mockResponse = { status: true, message: "Transfer retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfers.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`transfer/${payload.id_or_code}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("verify", () => {
    it("should call verify with correct reference", async () => {
      const payload = { reference: "ref-123" };
      const mockResponse = { status: true, message: "Transfer verified" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfers.verify(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`transfer/verify/${payload.reference}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
