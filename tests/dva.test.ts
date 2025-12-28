import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDedicatedVirtualAccounts } from "../src/dedicated-virtual-accounts/dva";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Dedicated Virtual Accounts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const dva = createDedicatedVirtualAccounts(mockKy);

	describe("create", () => {
		it("should call create with correct payload", async () => {
			const payload = {
				customer: "CUS_123",
				preferred_bank: "wema-bank",
			};
			const mockResponse = { status: true, message: "DVA created" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.create(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith("dedicated_account", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("assign", () => {
		it("should call assign with correct payload", async () => {
			const payload = {
				email: "test@example.com",
				first_name: "John",
				last_name: "Doe",
				phone: "08012345678",
				preferred_bank: "wema-bank",
				country: "NG",
			};
			const mockResponse = { status: true, message: "DVA assigned" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.assign(payload as any);

			expect(mockKy.put).toHaveBeenCalledWith("dedicated_account/assign", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("list", () => {
		it("should call list with correct search params", async () => {
			const payload = {
				active: true,
				currency: "NGN" as const,
			};
			const mockResponse = { status: true, message: "DVAs retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.list(payload);

			expect(mockKy.get).toHaveBeenCalledWith("dedicated_account", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct id", async () => {
			const payload = { dedicated_account_id: 123 };
			const mockResponse = { status: true, message: "DVA retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(`dedicated_account/${payload.dedicated_account_id}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("requery", () => {
		it("should call requery with correct search params", async () => {
			const payload = {
				account_number: "1234567890",
				provider_slug: "wema-bank",
			};
			const mockResponse = { status: true, message: "DVA requeried" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.requery(payload as any);

			expect(mockKy.get).toHaveBeenCalledWith("dedicated_account/requery", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("deactivate", () => {
		it("should call deactivate with correct id", async () => {
			const payload = { dedicated_account_id: 123 };
			const mockResponse = { status: true, message: "DVA deactivated" };
			(mockKy.delete as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.deactivate(payload);

			expect(mockKy.delete).toHaveBeenCalledWith(`dedicated_account/${payload.dedicated_account_id}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("splitTransaction", () => {
		it("should call splitTransaction with correct payload", async () => {
			const payload = {
				customer: "CUS_123",
				subaccount: "ACCT_123",
			};
			const mockResponse = { status: true, message: "Transaction split" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.splitTransaction(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith("dedicated_account/split", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("listBankProviders", () => {
		it("should call available_providers", async () => {
			const mockResponse = { status: true, message: "Providers retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.listBankProviders();

			expect(mockKy.get).toHaveBeenCalledWith("dedicated_account/available_providers");
			expect(result).toEqual(mockResponse);
		});
	});

	describe("removeSplit", () => {
		it("should call delete split with account_number", async () => {
			const payload = { account_number: "1234567890" };
			const mockResponse = { status: true, message: "Split removed" };
			(mockKy.delete as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await dva.removeSplit(payload);

			expect(mockKy.delete).toHaveBeenCalledWith("dedicated_account/split", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
