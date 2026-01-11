import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMiscellaneous } from "../src/miscellaneous/miscellaneous";

// Mock Ky instance
const mockKy = {
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Miscellaneous", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const miscellaneous = createMiscellaneous(mockKy);

  describe("listBanks", () => {
    it("should call listBanks with correct payload", async () => {
      const payload = {
        country: "nigeria" as const,
        use_cursor: true,
        perPage: 10,
      };
      const mockResponse = { status: true, message: "Banks retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await miscellaneous.listBanks(payload);

      expect(mockKy.get).toHaveBeenCalledWith("bank", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listCountries", () => {
    it("should call listCountries", async () => {
      const mockResponse = { status: true, message: "Countries retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await miscellaneous.listCountries();

      expect(mockKy.get).toHaveBeenCalledWith("country");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("listStates", () => {
    it("should call listStates with correct payload", async () => {
      const payload = { country: 1 };
      const mockResponse = { status: true, message: "States retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await miscellaneous.listStates(payload);

      expect(mockKy.get).toHaveBeenCalledWith("state", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
