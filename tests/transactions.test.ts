import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransactions } from "../src/transactions/transactions";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Transactions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const transactions = createTransactions(mockKy);

	describe("initialize", () => {
		it("should call initialize with correct payload", async () => {
			const payload = {
				amount: "5000",
				email: "test@example.com",
				channels: ["card", "bank"],
			};

			const mockResponse = {
				status: true,
				message: "Authorization URL created",
			};
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

	describe("verify", () => {
		it("should call verify with correct reference", async () => {
			const reference = "ref_123456";
			const mockResponse = { status: true, message: "Verification successful" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.verify({ reference });

			expect(mockKy.get).toHaveBeenCalledWith(
				`transaction/verify/${reference}`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("list", () => {
		it("should call list with correct search params", async () => {
			const payload = {
				page: 1,
				perPage: 20,
				status: "success",
			};
			const mockResponse = { status: true, message: "Transactions retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.list(payload as any);

			expect(mockKy.get).toHaveBeenCalledWith("transaction", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});

		it("should call list with empty params if none provided", async () => {
			const mockResponse = { status: true, message: "Transactions retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			await transactions.list();

			expect(mockKy.get).toHaveBeenCalledWith("transaction", {
				searchParams: {},
			});
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct id", async () => {
			const id = 12345;
			const mockResponse = { status: true, message: "Transaction retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.fetch({ id });

			expect(mockKy.get).toHaveBeenCalledWith(`transaction/${id}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("chargeAuthorization", () => {
		it("should call chargeAuthorization with correct payload", async () => {
			const payload = {
				amount: "1000",
				email: "user@example.com",
				authorization_code: "AUTH_code123",
			};
			const mockResponse = { status: true, message: "Charge successful" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.chargeAuthorization(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith(
				"transaction/charge_authorization",
				{
					json: payload,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("viewTimeline", () => {
		it("should call viewTimeline with correct id or reference", async () => {
			const id_or_reference = "ref_timeline";
			const mockResponse = { status: true, message: "Timeline retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.viewTimeline({ id_or_reference });

			expect(mockKy.get).toHaveBeenCalledWith(
				`transaction/timeline/${id_or_reference}`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("transactionTotals", () => {
		it("should call transactionTotals with correct search params", async () => {
			const payload = {
				page: 1,
				perPage: 10,
			};
			const mockResponse = { status: true, message: "Totals retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.transactionTotals(payload);

			expect(mockKy.get).toHaveBeenCalledWith("transaction/totals", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});

		it("should call transactionTotals with empty params if none provided", async () => {
			const mockResponse = { status: true, message: "Totals retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			await transactions.transactionTotals();

			expect(mockKy.get).toHaveBeenCalledWith("transaction/totals", {
				searchParams: {},
			});
		});
	});

	describe("exportTransaction", () => {
		it("should call exportTransaction with correct search params", async () => {
			const payload = {
				from: "2023-01-01",
				to: "2023-12-31",
				settled: true,
			};
			const mockResponse = { status: true, message: "Export successful" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			// We need to match how the schema transforms dates or expects strings
			// The schema expects dates or strings and transforms them.
			// The test payload passes strings which are valid ISO dates, so schema validation should pass.
			const result = await transactions.exportTransaction(payload as any);

			// The actual call might transform the payload slightly (e.g. date objects to strings),
			// but here we passed strings that match the schema's expectation or transformation.
			// Let's check what the function calls ky with.
			// The schema transforms date inputs to ISO strings.

			expect(mockKy.get).toHaveBeenCalledWith("transaction/export", {
				searchParams: expect.objectContaining({
					from: expect.any(String),
					to: expect.any(String),
					settled: true,
				}),
			});
			expect(result).toEqual(mockResponse);
		});

		it("should call exportTransaction with empty params if none provided", async () => {
			const mockResponse = { status: true, message: "Export successful" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			await transactions.exportTransaction();

			expect(mockKy.get).toHaveBeenCalledWith("transaction/export", {
				searchParams: {},
			});
		});
	});

	describe("partialDebit", () => {
		it("should call partialDebit with correct payload", async () => {
			const payload = {
				authorization_code: "AUTH_partial",
				amount: "2000",
				currency: "NGN",
				email: "partial@example.com",
			};
			const mockResponse = {
				status: true,
				message: "Partial debit successful",
			};
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await transactions.partialDebit(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith("transaction/partial_debit", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
