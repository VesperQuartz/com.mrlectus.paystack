import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSubaccounts } from "../src/subaccounts/subaccounts";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Subaccounts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const subaccounts = createSubaccounts(mockKy);

	describe("create", () => {
		it("should call create with correct payload", async () => {
			const payload = {
				business_name: "Test Business",
				bank_code: "011",
				account_number: "1234567890",
				percentage_charge: 10,
			};
			const mockResponse = { status: true, message: "Subaccount created" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await subaccounts.create(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith("subaccount", {
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
			const mockResponse = { status: true, message: "Subaccounts retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await subaccounts.list(payload as any);

			expect(mockKy.get).toHaveBeenCalledWith("subaccount", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct id_or_code", async () => {
			const payload = { id_or_code: "SUB_123" };
			const mockResponse = { status: true, message: "Subaccount retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await subaccounts.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(`subaccount/${payload.id_or_code}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("update", () => {
		it("should call update with correct payload", async () => {
			const payload = {
				id_or_code: "SUB_123",
				business_name: "Updated Business",
				description: "New Description",
			};
			const mockResponse = { status: true, message: "Subaccount updated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { id_or_code, ...rest } = payload;
			const result = await subaccounts.update(payload as any);

			expect(mockKy.put).toHaveBeenCalledWith(`subaccount/${id_or_code}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
