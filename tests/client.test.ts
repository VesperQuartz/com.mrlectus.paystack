import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PaystackClient } from "../src/paystack";

describe("PaystackClient", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.PAYSTACK_SECRET;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw error if no secret key is provided and no env variable set", () => {
    expect(() => PaystackClient()).toThrow("Secret key is required");
  });

  it("should not throw error if secret key is provided", () => {
    expect(() => PaystackClient("sk_test_123")).not.toThrow();
  });

  it("should not throw error if env variable is set", () => {
    process.env.PAYSTACK_SECRET = "sk_test_env_123";
    expect(() => PaystackClient()).not.toThrow();
  });

  it("should not throw error if both are provided", () => {
    process.env.PAYSTACK_SECRET = "sk_test_env_123";
    expect(() => PaystackClient("sk_test_arg_123")).not.toThrow();
  });

  it("should initialize with config object as first argument", () => {
    process.env.PAYSTACK_SECRET = "sk_test_env_123";
    expect(() => PaystackClient({ timeout: 5000 })).not.toThrow();
  });

  it("should initialize with secret key and config object", () => {
    expect(() => PaystackClient("sk_test_123", { debug: true })).not.toThrow();
  });
});
