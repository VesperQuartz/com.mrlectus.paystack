import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPaymentPage } from "../src/payment-page/payment-page";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  put: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Payment Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const paymentPage = createPaymentPage(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        name: "New Page",
        description: "Page Description",
        amount: 5000,
      };
      const mockResponse = { status: true, message: "Page created" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await paymentPage.create(payload);

      expect(mockKy.post).toHaveBeenCalledWith("page", {
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
      const mockResponse = { status: true, message: "Pages retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await paymentPage.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("page", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id_or_slug", async () => {
      const payload = { id_or_slug: "page_slug" };
      const mockResponse = { status: true, message: "Page retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await paymentPage.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`page/${payload.id_or_slug}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should call update with correct payload", async () => {
      const payload = {
        id_or_slug: "page_slug",
        name: "Updated Page",
        description: "Updated Description",
      };
      const mockResponse = { status: true, message: "Page updated" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id_or_slug, ...rest } = payload;
      const result = await paymentPage.update(payload);

      expect(mockKy.put).toHaveBeenCalledWith(`page/${id_or_slug}`, {
        json: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("checkSlugAvailability", () => {
    it("should call checkSlugAvailability with correct slug", async () => {
      const payload = { slug: "new-slug" };
      const mockResponse = { status: true, message: "Slug available" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await paymentPage.checkSlugAvailability(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`page/check_slug_availability/${payload.slug}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("addProduct", () => {
    it("should call addProduct with correct payload", async () => {
      const payload = { id: 123, product: [456, 789] };
      const mockResponse = { status: true, message: "Product added" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await paymentPage.addProduct(payload);

      expect(mockKy.post).toHaveBeenCalledWith(`page/${payload.id}/product`, {
        json: payload.product,
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
