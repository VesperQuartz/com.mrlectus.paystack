import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDirectDebit } from "../src/direct-debit/debit";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Direct Debit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const directDebit = createDirectDebit(mockKy);

	describe("triggerActivationCharge", () => {
		it("should call triggerActivationCharge with correct payload", async () => {
			const payload = {
				customer_ids: [123, 456],
			};
			const mockResponse = {
				status: true,
				message: "Activation charge triggered",
			};
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await directDebit.triggerActivationCharge(payload);

			expect(mockKy.put).toHaveBeenCalledWith("directdebit/activation-charge", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("listMandateAuthorizations", () => {
		it("should call listMandateAuthorizations with correct search params", async () => {
			const payload = {
				status: "active" as const,
				per_page: 10,
				cursor: "cursor_123",
			};
			const mockResponse = {
				status: true,
				message: "Mandate authorizations retrieved",
			};
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await directDebit.listMandateAuthorizations(payload);

			expect(mockKy.get).toHaveBeenCalledWith("directdebit/mandate-authorizations", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
