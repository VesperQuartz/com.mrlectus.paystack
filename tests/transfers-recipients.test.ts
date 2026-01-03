import type { KyInstance } from "ky";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransferRecipients } from "../src/transfers-recipients/recipients";

// Mock Ky instance
const mockKy = {
  post: vi.fn().mockReturnThis(),
  get: vi.fn().mockReturnThis(),
  put: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as KyInstance;

describe("Transfer Recipients", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const recipients = createTransferRecipients(mockKy);

  describe("create", () => {
    it("should call create with correct payload", async () => {
      const payload = {
        type: "nuban" as const,
        name: "Zombie Recipient",
        account_number: "0101010101",
        bank_code: "057",
      };
      const mockResponse = { status: true, message: "Recipient created" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await recipients.create(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transferrecipient", {
        json: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("bulkCreate", () => {
    it("should call bulkCreate with correct payload", async () => {
      const payload = {
        batch: [
          {
            type: "nuban" as const,
            name: "Zombie Recipient 1",
            account_number: "0101010101",
            bank_code: "057",
          },
          {
            type: "nuban" as const,
            name: "Zombie Recipient 2",
            account_number: "0101010102",
            bank_code: "057",
          },
        ],
      };
      const mockResponse = { status: true, message: "Recipients created" };
      (mockKy.post as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await recipients.bulkCreate(payload);

      expect(mockKy.post).toHaveBeenCalledWith("transferrecipient/bulk", {
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
      const mockResponse = { status: true, message: "Recipients retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await recipients.list(payload);

      expect(mockKy.get).toHaveBeenCalledWith("transferrecipient", {
        searchParams: payload,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetch", () => {
    it("should call fetch with correct id_or_code", async () => {
      const payload = { id_or_code: "RCP_12345" };
      const mockResponse = { status: true, message: "Recipient retrieved" };
      (mockKy.get as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await recipients.fetch(payload);

      expect(mockKy.get).toHaveBeenCalledWith(`transferrecipient/${payload.id_or_code}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("should call update with correct payload", async () => {
      const payload = {
        id_or_code: "RCP_12345",
        name: "Updated Recipient Name",
        email: "zombie@example.com",
      };
      const mockResponse = { status: true, message: "Recipient updated" };
      (mockKy.put as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const { id_or_code, ...rest } = payload;
      const result = await recipients.update(payload);

      expect(mockKy.put).toHaveBeenCalledWith(`transferrecipient/${id_or_code}`, {
        json: rest,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("should call delete with correct id_or_code", async () => {
      const payload = { id_or_code: "RCP_12345" };
      const mockResponse = { status: true, message: "Recipient deleted" };
      (mockKy.delete as any).mockReturnValue({
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const result = await recipients.delete(payload);

      expect(mockKy.delete).toHaveBeenCalledWith(`transferrecipient/${payload.id_or_code}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
