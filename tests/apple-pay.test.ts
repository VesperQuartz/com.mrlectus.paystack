import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApplePay } from "../src/apple-pay/pay";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Apple Pay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const applePay = createApplePay(mockKy);

  describe("registerDomain", () => {
    it("should call registerDomain with correct payload", async () => {
      const payload = { domainName: "example.com" };
      const mockResponse = { status: true, message: "Domain registered" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await applePay.registerDomain(payload);

      expect(mockKy.post).toHaveBeenCalledWith("apple-pay/domain", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listDomains", () => {
    it("should call listDomains with correct search params", async () => {
      const payload = { use_cursor: true, next: "cursor_123" };
      const mockResponse = { status: true, message: "Domains retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await applePay.listDomains(payload);

      expect(mockKy.get).toHaveBeenCalledWith("apple-pay/domain", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("unregisterDomain", () => {
    it("should call unregisterDomain with correct payload", async () => {
      const payload = { domainName: "example.com" };
      const mockResponse = { status: true, message: "Domain unregistered" };
      (mockKy.delete as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await applePay.unregisterDomain(payload);

      expect(mockKy.delete).toHaveBeenCalledWith("apple-pay/domain", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
