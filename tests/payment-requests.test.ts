import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPaymentRequests } from "../src/payment-requests/requests";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Payment Requests", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const paymentRequests = createPaymentRequests(mockKy);

	describe("create", () => {
		it("should call create with correct payload", async () => {
			const payload = {
				customer: "CUS_12345",
				amount: 5000,
			};
			const mockResponse = { status: true, message: "Payment request created" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.create(payload);

			expect(mockKy.post).toHaveBeenCalledWith("paymentrequest", {
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
				customer: "CUS_12345",
				status: "pending",
				currency: "NGN" as const,
				include_archive: "false",
			};
			const mockResponse = { status: true, message: "Payment requests retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.list(payload);

			expect(mockKy.get).toHaveBeenCalledWith("paymentrequest", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct id_or_code", async () => {
			const payload = { id_or_code: "PRQ_12345" };
			const mockResponse = { status: true, message: "Payment request retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(`paymentrequest/${payload.id_or_code}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("verify", () => {
		it("should call verify with correct code", async () => {
			const payload = { code: "PRQ_12345" };
			const mockResponse = { status: true, message: "Payment request verified" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.verify(payload);

			expect(mockKy.get).toHaveBeenCalledWith(`paymentrequest/verify/${payload.code}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("sendNotification", () => {
		it("should call sendNotification with correct code", async () => {
			const payload = { code: "PRQ_12345" };
			const mockResponse = { status: true, message: "Notification sent" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.sendNotification(payload);

			expect(mockKy.post).toHaveBeenCalledWith(`paymentrequest/notify/${payload.code}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("totals", () => {
		it("should call totals", async () => {
			const mockResponse = { status: true, message: "Totals retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.totals();

			expect(mockKy.get).toHaveBeenCalledWith("paymentrequest/totals");
			expect(result).toEqual(mockResponse);
		});
	});

	describe("finalize", () => {
		it("should call finalize with correct payload", async () => {
			const payload = { code: "PRQ_12345", send_notification: true };
			const mockResponse = { status: true, message: "Payment request finalized" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await paymentRequests.finalize(payload);

			expect(mockKy.post).toHaveBeenCalledWith(`paymentrequest/finalize/${code}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("update", () => {
		it("should call update with correct payload", async () => {
			const payload = {
				id_or_code: "PRQ_12345",
				customer: "CUS_12345",
				amount: 6000,
			};
			const mockResponse = { status: true, message: "Payment request updated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { id_or_code, ...rest } = payload;
			const result = await paymentRequests.update(payload);

			expect(mockKy.put).toHaveBeenCalledWith(`paymentrequest/${id_or_code}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("archive", () => {
		it("should call archive with correct code", async () => {
			const payload = { code: "PRQ_12345" };
			const mockResponse = { status: true, message: "Payment request archived" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await paymentRequests.archive(payload);

			expect(mockKy.post).toHaveBeenCalledWith(`paymentrequest/archive/${payload.code}`);
			expect(result).toEqual(mockResponse);
		});
	});
});
