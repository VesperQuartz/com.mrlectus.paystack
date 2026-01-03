import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlans } from "../src/plans/plans";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  put: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Plans", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const plans = createPlans(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        name: "Monthly Plan",
        amount: 5000,
        interval: "monthly" as const,
      };
      const mockResponse = { status: true, message: "Plan created" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await plans.create(payload);

      expect(mockKy.post).toHaveBeenCalledWith("plan", {
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
        interval: "monthly" as const,
      };
      const mockResponse = { status: true, message: "Plans retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await plans.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("plan", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id_or_code", async () => {
      const payload = { id_or_code: "PLN_123" };
      const mockResponse = { status: true, message: "Plan retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await plans.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`plan/${payload.id_or_code}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should call update with correct payload", async () => {
      const payload = {
        id_or_code: "PLN_123",
        name: "Updated Plan Name",
        amount: 6000,
        interval: "monthly" as const,
      };
      const mockResponse = { status: true, message: "Plan updated" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id_or_code, ...rest } = payload;
      const result = await plans.update(payload);

      expect(mockKy.put).toHaveBeenCalledWith(`plan/${id_or_code}`, {
        json: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
