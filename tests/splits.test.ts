import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransactionSplits } from "../src/transaction-splits/splits";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  put: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Transaction Splits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const splits = createTransactionSplits(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        name: "Test Split",
        type: "percentage",
        currency: "NGN",
        subaccounts: [{ subaccount: "ACCT_123", share: 20 }],
        bearer_type: "account",
        bearer_subaccount: "ACCT_123",
      };

      const mockResponse = { status: true, message: "Split created" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await splits.create(payload as any);

      expect(mockKy.post).toHaveBeenCalledWith("split", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("list", () => {
    it("should call list with correct search params", async () => {
      const payload = {
        name: "Test Split",
        active: true,
        perPage: 10,
        page: 1,
      };
      const mockResponse = { status: true, message: "Splits retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await splits.list(payload as any);

      expect(mockKy.get).toHaveBeenCalledWith("split", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id", async () => {
      const id = "12345";
      const mockResponse = { status: true, message: "Split retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await splits.fetch({ id });

      expect(mockKy.get).toHaveBeenCalledWith(`split/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should call update with correct payload and id", async () => {
      const payload = {
        id: "123",
        name: "Updated Split",
        active: true,
        bearer_type: "subaccount",
        bearer_subaccount: "ACCT_NEW",
      };
      const mockResponse = { status: true, message: "Split updated" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // Helper to strip id from payload for expectation
      const { id, ...expectedData } = payload;

      const result = await splits.update(payload as any);

      expect(mockKy.put).toHaveBeenCalledWith(`split/${id}`, {
        json: expectedData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("updateSubaccount", () => {
    it("should call updateSubaccount with correct payload", async () => {
      const payload = {
        id: "123",
        subaccount: "ACCT_456",
        share: 50,
      };
      const mockResponse = { status: true, message: "Subaccount updated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...expectedData } = payload;

      const result = await splits.updateSubaccount(payload);

      expect(mockKy.post).toHaveBeenCalledWith(`split/${id}/subaccount/add`, {
        json: expectedData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("removeSubaccount", () => {
    it("should call removeSubaccount with correct payload", async () => {
      const payload = {
        id: "123",
        subaccount: "ACCT_789",
        share: 0, // share is required by type but omitted in schema logic usually for removal?
        // Let's check the implementation. logic says: z.omit(..., { share: true })
      };
      const mockResponse = { status: true, message: "Subaccount removed" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      // The implementation omits 'share' from the payload sent to API
      const { id, share, ...expectedData } = payload;

      const result = await splits.removeSubaccount(payload);

      expect(mockKy.post).toHaveBeenCalledWith(`split/${id}/subaccount/remove`, {
        json: expectedData,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
