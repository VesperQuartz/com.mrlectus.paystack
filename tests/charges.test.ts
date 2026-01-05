import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCharges } from "../src/charges/charges";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Charges", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const charges = createCharges(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        email: "customer@email.com",
        amount: "10000",
      };
      const mockResponse = { status: true, message: "Charge initiated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.create(payload);

      expect(mockKy.post).toHaveBeenCalledWith("charge", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("submitPin", () => {
    it("should call submitPin with correct payload", async () => {
      const payload = { reference: "ref-123", pin: "1234" };
      const mockResponse = { status: true, message: "PIN submitted" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.submitPin(payload);

      expect(mockKy.post).toHaveBeenCalledWith("charge/submit_pin", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("submitOtp", () => {
    it("should call submitOtp with correct payload", async () => {
      const payload = { reference: "ref-123", otp: "123456" };
      const mockResponse = { status: true, message: "OTP submitted" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.submitOtp(payload);

      expect(mockKy.post).toHaveBeenCalledWith("charge/submit_otp", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("submitPhone", () => {
    it("should call submitPhone with correct payload", async () => {
      const payload = { reference: "ref-123", phone: "08012345678" };
      const mockResponse = { status: true, message: "Phone submitted" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.submitPhone(payload);

      expect(mockKy.post).toHaveBeenCalledWith("charge/submit_phone", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("submitBirthday", () => {
    it("should call submitBirthday with correct payload", async () => {
      const date = new Date("1990-01-01");
      const payload = { reference: "ref-123", birthday: date.toISOString() };
      const mockResponse = { status: true, message: "Birthday submitted" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.submitBirthday(payload);

      expect(mockKy.post).toHaveBeenCalledWith("charge/submit_birthday", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("submitAddress", () => {
    it("should call submitAddress with correct payload", async () => {
      const payload = {
        reference: "ref-123",
        address: "123 Street",
        city: "Lagos",
        state: "Lagos",
        zipcode: "100001",
      };
      const mockResponse = { status: true, message: "Address submitted" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.submitAddress(payload);

      expect(mockKy.post).toHaveBeenCalledWith("charge/submit_address", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("checkPending", () => {
    it("should call checkPending with correct reference", async () => {
      const payload = { reference: "ref-123" };
      const mockResponse = { status: true, message: "Charge checked" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await charges.checkPending(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`charge/${payload.reference}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
