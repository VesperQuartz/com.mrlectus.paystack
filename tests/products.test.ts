import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createProducts } from "../src/products/products";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Products", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const products = createProducts(mockKy);

	describe("create", () => {
		it("should call create with correct payload", async () => {
			const payload = {
				name: "Product Name",
				description: "Product Description",
				price: 5000,
				currency: "NGN",
			};
			const mockResponse = { status: true, message: "Product created" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await products.create(payload);

			expect(mockKy.post).toHaveBeenCalledWith("product", {
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
			const mockResponse = { status: true, message: "Products retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await products.list(payload);

			expect(mockKy.get).toHaveBeenCalledWith("product", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct id", async () => {
			const payload = { id: "PROD_123" };
			const mockResponse = { status: true, message: "Product retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await products.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(`product/${payload.id}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("update", () => {
		it("should call update with correct payload", async () => {
			const payload = {
				id: "PROD_123",
				name: "Updated Product Name",
				description: "Updated Description",
				price: 6000,
				currency: "NGN",
			};
			const mockResponse = { status: true, message: "Product updated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { id, ...rest } = payload;
			const result = await products.update(payload);

			expect(mockKy.put).toHaveBeenCalledWith(`product/${id}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
