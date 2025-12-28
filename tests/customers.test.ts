import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCustomer } from "../src/customers/customers";

// Mock Ky instance
const mockKy = {
	post: vi.fn().mockReturnThis(),
	get: vi.fn().mockReturnThis(),
	put: vi.fn().mockReturnThis(),
	delete: vi.fn().mockReturnThis(),
	json: vi.fn(),
} as unknown as KyInstance;

describe("Customers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	const customer = createCustomer(mockKy);

	describe("create", () => {
		it("should call create with correct payload", async () => {
			const payload = {
				email: "customer@example.com",
				first_name: "John",
				last_name: "Doe",
				phone: "08012345678",
			};
			const mockResponse = { status: true, message: "Customer created" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.create(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith("customer", {
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
			const mockResponse = { status: true, message: "Customers retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.list(payload as any);

			expect(mockKy.get).toHaveBeenCalledWith("customer", {
				searchParams: payload,
			});
			expect(result).toEqual(mockResponse);
		});

		it("should call list with empty params if none provided", async () => {
			const mockResponse = { status: true, message: "Customers retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			await customer.list();

			expect(mockKy.get).toHaveBeenCalledWith("customer", {
				searchParams: {},
			});
		});
	});

	describe("fetch", () => {
		it("should call fetch with correct email_or_code", async () => {
			const payload = { email_or_code: "CUS_123" };
			const mockResponse = { status: true, message: "Customer retrieved" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.fetch(payload);

			expect(mockKy.get).toHaveBeenCalledWith(
				`customer/${payload.email_or_code}`,
				{
					searchParams: payload,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("update", () => {
		it("should call update with correct payload", async () => {
			const payload = {
				code: "CUS_123",
				first_name: "Jane",
				last_name: "Doe",
			};
			const mockResponse = { status: true, message: "Customer updated" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await customer.update(payload as any);

			expect(mockKy.put).toHaveBeenCalledWith(`customer/${code}`, {
				json: rest,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("validate", () => {
		it("should call validate with correct payload", async () => {
			const payload = {
				code: "CUS_123",
				first_name: "John",
				last_name: "Doe",
				type: "bank_account",
				value: "1234567890",
				country: "NG",
				bvn: "22222222222",
				bank_code: "011",
				account_number: "1234567890",
			};
			const mockResponse = { status: true, message: "Customer validated" };
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { code, ...rest } = payload;
			const result = await customer.validate(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith(
				`customer/${code}/identification`,
				{
					json: rest,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("setRiskAction", () => {
		it("should call setRiskAction with correct payload", async () => {
			const payload = {
				customer: "CUS_123",
				risk_action: "allow",
			};
			const mockResponse = { status: true, message: "Risk action set" };
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.setRiskAction(payload as any);

			expect(mockKy.put).toHaveBeenCalledWith("customer/set_risk_action", {
				json: payload,
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe("initializeAuthorization", () => {
		it("should call initializeAuthorization with correct payload", async () => {
			const payload = {
				email: "customer@example.com",
				channel: "direct_debit",
			};
			const mockResponse = {
				status: true,
				message: "Authorization initialized",
			};
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.initializeAuthorization(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith(
				"customer/authorization/initialize",
				{
					json: payload,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("verifyAuthorization", () => {
		it("should call verifyAuthorization with correct reference", async () => {
			const reference = "REF_123";
			const mockResponse = { status: true, message: "Authorization verified" };
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.verifyAuthorization({ reference });

			expect(mockKy.get).toHaveBeenCalledWith(
				`customer/authorization/verify/${reference}`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("initializeDirectDebit", () => {
		it("should call initializeDirectDebit with correct payload", async () => {
			const payload = {
				id: "123",
				account: { number: "1234567890", bank_code: "011" },
				address: { street: "Street", city: "City", state: "State" },
			};
			const mockResponse = {
				status: true,
				message: "Direct debit initialized",
			};
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { id, ...rest } = payload;
			const result = await customer.initializeDirectDebit(payload as any);

			expect(mockKy.post).toHaveBeenCalledWith(
				`customer/${id}/initialize-direct-debit`,
				{
					json: rest,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("directDebitActivationCharge", () => {
		it("should call directDebitActivationCharge with correct payload", async () => {
			const payload = {
				id: 123,
				authorization_id: 456,
			};
			const mockResponse = {
				status: true,
				message: "Activation charge successful",
			};
			(mockKy.put as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const { id, ...rest } = payload;
			const result = await customer.directDebitActivationCharge(payload);

			expect(mockKy.put).toHaveBeenCalledWith(
				`customer/authorization/${id}/direct-debit-activation-charge`,
				{
					json: rest,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("fetchMandateAuthorizations", () => {
		it("should call fetchMandateAuthorizations with correct id", async () => {
			const id = 123;
			const mockResponse = {
				status: true,
				message: "Mandate authorizations retrieved",
			};
			(mockKy.get as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.fetchMandateAuthorizations({ id });

			expect(mockKy.get).toHaveBeenCalledWith(
				`customer/${id}/directdebit-mandate-authorizations`,
			);
			expect(result).toEqual(mockResponse);
		});
	});

	describe("deactivateAuthorization", () => {
		it("should call deactivateAuthorization with correct authorization_code", async () => {
			const payload = { authorization_code: "AUTH_123" };
			const mockResponse = {
				status: true,
				message: "Authorization deactivated",
			};
			(mockKy.post as any).mockReturnValue({
				json: vi.fn().mockResolvedValue(mockResponse),
			});

			const result = await customer.deactivateAuthorization(payload);

			expect(mockKy.post).toHaveBeenCalledWith(
				`customer/authorization/deactivate`,
				{
					json: payload,
				},
			);
			expect(result).toEqual(mockResponse);
		});
	});
});
