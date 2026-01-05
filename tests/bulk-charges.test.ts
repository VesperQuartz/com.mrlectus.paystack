import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBulkCharges } from "../src/bulk-charges/bulk";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Bulk Charges", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const bulkCharges = createBulkCharges(mockKy);

  describe("initiate", () => {
    it("should call initiate with correct payload", async () => {
      const payload = [
        {
          authorization: "AUTH_12345",
          amount: 5000,
          reference: "ref-123",
        },
      ];
      const mockResponse = { status: true, message: "Bulk charge initiated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await bulkCharges.initiate(payload);

      expect(mockKy.post).toHaveBeenCalledWith("bulkcharge", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listBatches", () => {
    it("should call listBatches with correct search params", async () => {
      const payload = {
        perPage: 10,
        page: 1,
      };
      const mockResponse = { status: true, message: "Batches retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await bulkCharges.listBatches(payload);

      expect(mockKy.get).toHaveBeenCalledWith("bulkcharge", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id_or_code", async () => {
      const payload = { id_or_code: "BCH_12345" };
      const mockResponse = { status: true, message: "Batch retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await bulkCharges.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`bulkcharge/${payload.id_or_code}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchBatch", () => {
    it("should call fetchBatch with correct params", async () => {
      const payload = {
        id_or_code: "BCH_12345",
        status: "pending" as const,
        perPage: 10,
        page: 1,
      };
      const mockResponse = { status: true, message: "Batch charges retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id_or_code, ...rest } = payload;
      const result = await bulkCharges.fetchBatch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`bulkcharge/${id_or_code}/charges`, {
        searchParams: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("pauseBatch", () => {
    it("should call pauseBatch with correct batch_code", async () => {
      const payload = { batch_code: "BCH_12345" };
      const mockResponse = { status: true, message: "Batch paused" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await bulkCharges.pauseBatch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`bulkcharge/pause/${payload.batch_code}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resumeBatch", () => {
    it("should call resumeBatch with correct batch_code", async () => {
      const payload = { batch_code: "BCH_12345" };
      const mockResponse = { status: true, message: "Batch resumed" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await bulkCharges.resumeBatch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`bulkcharge/resume/${payload.batch_code}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
