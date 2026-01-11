import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVerification } from "../src/verification/verification";

// Mock Ky instance
const mockKy = {
  get: vi.fn().mockReturnThis(),
  post: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Verification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const verification = createVerification(mockKy);

  describe("resolveAccount", () => {
    it("should call resolveAccount with correct payload", async () => {
      const payload = {
        account_number: "0001234567",
        bank_code: "058",
      };
      const mockResponse = {
        status: true,
        message: "Account resolved",
        data: { account_number: "0001234567", account_name: "Test Account" },
      };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await verification.resolveAccount(payload);

      expect(mockKy.get).toHaveBeenCalledWith("resolve", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("validateAccount", () => {
    it("should call validateAccount with correct payload", async () => {
      const payload = {
        account_name: "Anniedora Longhaul",
        account_number: "0123456789",
        account_type: "personal" as const,
        bank_code: "632",
        country_code: "ZA",
        document_type: "identityNumber" as const,
        document_number: "1234567890123",
      };
      const mockResponse = { status: true, message: "Account validated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await verification.validateAccount(payload);

      expect(mockKy.post).toHaveBeenCalledWith("bank/validate", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resolveCardBIN", () => {
    it("should call resolveCardBIN with correct payload", async () => {
      const payload = { bin: "539983" };
      const mockResponse = { status: true, message: "BIN resolved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await verification.resolveCardBIN(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`decision/bin/${payload.bin}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
