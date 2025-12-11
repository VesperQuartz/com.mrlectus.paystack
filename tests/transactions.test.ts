import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTransactions } from "../src/transactions/transactions";
import type { KyInstance } from "ky";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Transactions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should call initialize with correct payload", async () => {
		const transactions = createTransactions(mockKy);
		const payload = {
			amount: "5000",
			email: "test@example.com",
			channels: ["card", "bank"],
		};

		// Mock the json response
		const mockResponse = { status: true, message: "Authorization URL created" };
		(mockKy.post as any).mockReturnValue({
			json: vi.fn().mockResolvedValue(mockResponse),
		});

		const result = await transactions.initialize(payload as any);

		expect(mockKy.post).toHaveBeenCalledWith("transaction/initialize", {
			json: payload,
		});
		expect(result).toEqual(mockResponse);
	});
});
