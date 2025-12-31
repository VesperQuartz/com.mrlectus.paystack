import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTerminal } from "../src/terminal/terminal";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Terminal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const terminal = createTerminal(mockKy);

	describe("sendEvent", () => {
		it("should call sendEvent with correct invoice payload", async () => {
			const payload = {
				terminal_id: "TERM_123",
				type: "invoice",
				action: "process",
				data: {
					id: 12345,
					reference: 67890,
				},
			};
			const mockResponse = {
				status: true,
				message: "Event sent",
				data: { id: "evt_123" },
			};
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { terminal_id, ...rest } = payload;
			const result = await terminal.sendEvent(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith(
				`terminal/${terminal_id}/event`,
				{
					json: rest,
				},
			);
			expect(result).toEqual(mockResponse);
		});

		it("should call sendEvent with correct transaction payload", async () => {
			const payload = {
				terminal_id: "TERM_123",
				type: "transaction",
				action: "process",
				data: {
					id: 12345,
				},
			};
			const mockResponse = {
				status: true,
				message: "Event sent",
				data: { id: "evt_456" },
			};
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { terminal_id, ...rest } = payload;
			const result = await terminal.sendEvent(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith(
				`terminal/${terminal_id}/event`,
				{
					json: rest,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetchEventStatus", () => {
		it("should call fetchEventStatus with correct payload", async () => {
			const payload = {
				terminal_id: "TERM_123",
				event_id: "evt_123",
			};
			const mockResponse = {
				status: true,
				message: "Event status retrieved",
				data: { delivered: true },
			};
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await terminal.fetchEventStatus(payload);

			expect(mockKy.get).toHaveBeenCalledWith(
				`terminal/${payload.terminal_id}/event/${payload.event_id}`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetchStatus", () => {
		it("should call fetchStatus with correct terminal_id", async () => {
			const payload = { terminal_id: "TERM_123" };
			const mockResponse = {
				status: true,
				message: "Terminal status retrieved",
				data: { online: true, available: true },
			};
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await terminal.fetchStatus(payload);

			expect(mockKy.get).toHaveBeenCalledWith(
				`terminal/${payload.terminal_id}/presence`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("list", () => {
		it("should call list with correct search params", async () => {
			const payload = {
				status: "active" as const,
				perPage: 10,
				next: "cursor_123",
			};
			const mockResponse = { status: true, message: "Terminals retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await terminal.list(payload);

			expect(mockKy.get).toHaveBeenCalledWith("terminal", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});

		it("should call list with required status", async () => {
			const payload = { status: "active" as const };
			const mockResponse = { status: true, message: "Terminals retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			await terminal.list(payload);

			expect(mockKy.get).toHaveBeenCalledWith("terminal", {
				searchParams: payload,
			});
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct terminal_id", async () => {
			const payload = { terminal_id: "TERM_123" };
			const mockResponse = { status: true, message: "Terminal retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await terminal.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(
				`terminal/${payload.terminal_id}`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("update", () => {
		it("should call update with correct payload", async () => {
			const payload = {
				terminal_id: "TERM_123",
				name: "New Name",
				address: "New Address",
			};
			const mockResponse = { status: true, message: "Terminal updated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { terminal_id, ...rest } = payload;
			const result = await terminal.update(payload);

			expect(mockKy.put).toHaveBeenCalledWith(`terminal/${terminal_id}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("commission", () => {
		it("should call commission with correct serial_number", async () => {
			const payload = { serial_number: "SN_123456" };
			const mockResponse = { status: true, message: "Device commissioned" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await terminal.commission(payload);

			expect(mockKy.post).toHaveBeenCalledWith("terminal/decommission_device", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("decommission", () => {
		it("should call decommission with correct serial_number", async () => {
			const payload = { serial_number: "SN_123456" };
			const mockResponse = { status: true, message: "Device decommissioned" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await terminal.decommission(payload);

			expect(mockKy.post).toHaveBeenCalledWith("terminal/commission_device", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
