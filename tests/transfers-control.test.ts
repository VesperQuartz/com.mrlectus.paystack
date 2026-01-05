import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransfersControl } from "../src/transfers-control/control";

// Mock Ky instance
const mockKy = {
  get: vi.fn().mockReturnThis(),
  post: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Transfers Control", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const transfersControl = createTransfersControl(mockKy);

  describe("checkBalance", () => {
    it("should call checkBalance", async () => {
      const mockResponse = {
        status: true,
        message: "Balance retrieved",
        data: [{ currency: "NGN", balance: 5000 }],
      };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfersControl.checkBalance();

      expect(mockKy.get).toHaveBeenCalledWith("balance");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchBalanceLedger", () => {
    it("should call fetchBalanceLedger", async () => {
      const mockResponse = { status: true, message: "Ledger retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfersControl.fetchBalanceLedger();

      expect(mockKy.get).toHaveBeenCalledWith("balance/ledger");
      expect(result).toEqual(mockResponse);
    });
  });

  describe("resendOTP", () => {
    it("should call resendOTP with correct payload", async () => {
      const payload = {
        transfer_code: "TRF_12345",
        reason: "resend_otp",
      };
      const mockResponse = { status: true, message: "OTP resent" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfersControl.resendOTP(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transfer/resend_otp", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("disableOTP", () => {
    it("should call disableOTP", async () => {
      const mockResponse = { status: true, message: "OTP disable initiated" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfersControl.disableOTP();

      expect(mockKy.post).toHaveBeenCalledWith("transfer/disable_otp", {
        json: {},
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("finalizeDisableOTP", () => {
    it("should call finalizeDisableOTP with correct payload", async () => {
      const payload = { otp: "123456" };
      const mockResponse = { status: true, message: "OTP disabled" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfersControl.finalizeDisableOTP(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transfer/disable_otp_finalize", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("enableOTP", () => {
    it("should call enableOTP", async () => {
      const mockResponse = { status: true, message: "OTP enabled" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await transfersControl.enableOTP();

      expect(mockKy.post).toHaveBeenCalledWith("transfer/enable_otp", {
        json: {},
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
