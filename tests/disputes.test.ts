import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDisputes } from "../src/disputes/disputes";

// Mock Ky instance
const mockKy = {
  get: vi.fn().mockReturnThis(),
  put: vi.fn().mockReturnThis(),
  post: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Disputes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const disputes = createDisputes(mockKy);

  describe("list", () => {
    it("should call list with correct search params", async () => {
      const payload = {
        perPage: 10,
        page: 1,
        status: "pending" as const,
      };
      const mockResponse = { status: true, message: "Disputes retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await disputes.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("dispute", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id", async () => {
      const payload = { id: "DIS_12345" };
      const mockResponse = { status: true, message: "Dispute retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await disputes.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`dispute/${payload.id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listTranaction", () => {
    it("should call listTranaction with correct id", async () => {
      const payload = { id: "12345" };
      const mockResponse = { status: true, message: "Dispute transaction retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await disputes.listTranaction(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`dispute/transaction/${payload.id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should call update with correct payload", async () => {
      const payload = {
        id: "DIS_12345",
        refund_amount: 5000,
        uploaded_filename: "evidence.pdf",
      };
      const mockResponse = { status: true, message: "Dispute updated" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...rest } = payload;
      const result = await disputes.update(payload);

      expect(mockKy.put).toHaveBeenCalledWith(`dispute/${id}`, {
        json: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("addEvidence", () => {
    it("should call addEvidence with correct payload", async () => {
      const payload = {
        id: "DIS_12345",
        customer_email: "customer@email.com",
        customer_name: "Customer Name",
        customer_phone: "08012345678",
        service_details: "Service Details",
        delivery_address: "123 Street",
        delivery_date: new Date().toISOString(),
      };
      const mockResponse = { status: true, message: "Evidence added" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...rest } = payload;
      const result = await disputes.addEvidence(payload);

      expect(mockKy.post).toHaveBeenCalledWith(`dispute/${id}/evidence`, {
        json: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getUploadUrl", () => {
    it("should call getUploadUrl with correct payload", async () => {
      const payload = { id: "DIS_12345", upload_filename: "evidence.pdf" };
      const mockResponse = { status: true, message: "Upload URL retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...rest } = payload;
      const result = await disputes.getUploadUrl(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`dispute/${id}/upload_url`, {
        searchParams: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resolve", () => {
    it("should call resolve with correct payload", async () => {
      const payload = {
        id: "DIS_12345",
        resolution: "merchant-accepted" as const,
        message: "Resolved",
        refund_amount: 5000,
        uploaded_filename: "evidence.pdf",
      };
      const mockResponse = { status: true, message: "Dispute resolved" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id, ...rest } = payload;
      const result = await disputes.resolve(payload);

      expect(mockKy.put).toHaveBeenCalledWith(`dispute/${id}/resolve`, {
        json: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("exports", () => {
    it("should call exports with correct payload", async () => {
      const payload = {
        perPage: 10,
        page: 1,
      };
      const mockResponse = { status: true, message: "Disputes exported" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await disputes.exports(payload);

      expect(mockKy.put).toHaveBeenCalledWith("dispute/export", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
