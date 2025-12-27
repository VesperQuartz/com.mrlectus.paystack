import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVirtualTerminal } from "../src/virtual-terminal/vterminal";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Virtual Terminal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const vTerminal = createVirtualTerminal(mockKy);

	describe("create", () => {
		it("should call create with correct payload", async () => {
			const payload = {
				name: "Test VT",
				destinations: [{ target: "1234567890", name: "Support" }],
				metadata: ["some", "data"],
				currency: ["NGN"],
				custom_fields: [{ display_name: "Field 1", variable_name: "field_1" }],
			};
			const mockResponse = { status: true, message: "VT created" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await vTerminal.create(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith("virtual_terminal", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("list", () => {
		it("should call list with correct search params", async () => {
			const payload = {
				status: "active",
				perPage: 10,
			};
			const mockResponse = { status: true, message: "VTs retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await vTerminal.list(payload as any);

			expect(mockKy.get).toHaveBeenCalledWith("virtual_terminal", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct code", async () => {
			const payload = { code: "VT_123" };
			const mockResponse = { status: true, message: "VT retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await vTerminal.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(`virtual_terminal/${payload.code}`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("update", () => {
		it("should call update with correct payload", async () => {
			const payload = {
				code: "VT_123",
				name: "Updated VT",
			};
			const mockResponse = { status: true, message: "VT updated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await vTerminal.update(payload);

			expect(mockKy.put).toHaveBeenCalledWith(`virtual_terminal/${code}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("deactivate", () => {
		it("should call deactivate with correct code", async () => {
			const payload = { code: "VT_123" };
			const mockResponse = { status: true, message: "VT deactivated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await vTerminal.deactivate(payload);

			expect(mockKy.put).toHaveBeenCalledWith(`virtual_terminal/${payload.code}/deactivate`);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("assignDestination", () => {
		it("should call assignDestination with correct payload", async () => {
			const payload = {
				code: "VT_123",
				destinations: [{ target: "0987654321", name: "Sales" }],
			};
			const mockResponse = { status: true, message: "Destination assigned" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await vTerminal.assignDestination(payload);

			expect(mockKy.post).toHaveBeenCalledWith(`virtual_terminal/${code}/destination/assign`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("unassignDestination", () => {
		it("should call unassignDestination with correct payload", async () => {
			const payload = {
				code: "VT_123",
				targets: ["0987654321"],
			};
			const mockResponse = { status: true, message: "Destination unassigned" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await vTerminal.unassignDestination(payload);

			expect(mockKy.post).toHaveBeenCalledWith(`virtual_terminal/${code}/destination/unassign`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("addSplitCode", () => {
		it("should call addSplitCode with correct payload", async () => {
			const payload = {
				code: "VT_123",
				split_code: "SPL_123",
			};
			const mockResponse = { status: true, message: "Split code added" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await vTerminal.addSplitCode(payload);

			expect(mockKy.put).toHaveBeenCalledWith(`virtual_terminal/${code}/split_code`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("removeSplitCode", () => {
		it("should call removeSplitCode with correct payload", async () => {
			const payload = {
				code: "VT_123",
				split_code: "SPL_123",
			};
			const mockResponse = { status: true, message: "Split code removed" };
			(mockKy.delete as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await vTerminal.removeSplitCode(payload);

			expect(mockKy.delete).toHaveBeenCalledWith(`virtual_terminal/${code}/split_code`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});
});
