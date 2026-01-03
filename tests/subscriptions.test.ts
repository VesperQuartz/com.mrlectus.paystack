import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSubscriptions } from "../src/subscriptions/subscriptions";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Subscriptions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const subscriptions = createSubscriptions(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        customer: "CUS_123",
        plan: "PLN_123",
      };
      const mockResponse = { status: true, message: "Subscription created" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.create(payload);

      expect(mockKy.post).toHaveBeenCalledWith("subscription", {
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
      };
      const mockResponse = { status: true, message: "Subscriptions retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("subscription", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should call list with empty params if none provided", async () => {
      const mockResponse = { status: true, message: "Subscriptions retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      await subscriptions.list();

      expect(mockKy.get).toHaveBeenCalledWith("subscription", {
        searchParams: {},
      });
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id_or_code", async () => {
      const payload = { id_or_code: "SUB_123" };
      const mockResponse = { status: true, message: "Subscription retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`subscription/${payload.id_or_code}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("enable", () => {
    it("should call enable with correct payload", async () => {
      const payload = { code: "SUB_123", token: "TKN_123" };
      const mockResponse = { status: true, message: "Subscription enabled" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.enable(payload);

      expect(mockKy.post).toHaveBeenCalledWith("subscription/enable", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("disable", () => {
    it("should call disable with correct payload", async () => {
      const payload = { code: "SUB_123", token: "TKN_123" };
      const mockResponse = { status: true, message: "Subscription disabled" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.disable(payload);

      expect(mockKy.post).toHaveBeenCalledWith("subscription/disable", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("generateUpdatelink", () => {
    it("should call manage/link with correct code", async () => {
      const payload = { code: "SUB_123" };
      const mockResponse = {
        status: true,
        message: "Link generated",
        data: { link: "http://link" },
      };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.generateUpdatelink(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`subscription/${payload.code}/manage/link`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("sendUpdatelink", () => {
    it("should call manage/email with correct code", async () => {
      const payload = { code: "SUB_123" };
      const mockResponse = { status: true, message: "Email sent" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await subscriptions.sendUpdatelink(payload);

      expect(mockKy.post).toHaveBeenCalledWith(`subscription/${payload.code}/manage/email`);
      expect(result).toEqual(mockResponse);
    });
  });
});
