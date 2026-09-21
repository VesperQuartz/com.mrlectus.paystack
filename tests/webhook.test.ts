import { describe, expect, it } from "vitest";
import { EventDataSchema } from "../src/webhook/schema";

/**
 * Webhook payload factories.
 *
 * These mirror the shapes Paystack actually posts. The point of the suite is
 * that `EventDataSchema` is the one schema in the SDK where getting a field
 * wrong does not throw at the call site — it silently drops a real payment.
 * Every case here is anchored to a field the app reads to move money.
 */

const customer = {
  id: 1,
  first_name: "Ada",
  last_name: "Okonkwo",
  email: "ada@example.com",
  customer_code: "CUS_x",
  phone: "08012345678",
  metadata: {},
  risk_action: "default",
};

const authorization = {
  authorization_code: "AUTH_x",
  bin: "123456",
  last4: "1234",
  exp_month: "01",
  exp_year: "30",
  card_type: "visa",
  bank: "GTBank",
  country_code: "NG",
  brand: "visa",
  account_name: "ADA OKONKWO",
};

const log = {
  time_spent: 5,
  attempts: 1,
  authentication: "none",
  errors: 0,
  success: true,
  mobile: false,
  input: [],
  channel: "card",
  history: [],
};

const charge = (metadata: unknown) => ({
  event: "charge.success",
  data: {
    id: 1,
    domain: "test",
    status: "success",
    reference: "fixam-abc",
    amount: 10000000,
    message: null,
    gateway_response: "Successful",
    paid_at: "2026-09-21T00:00:00.000Z",
    created_at: "2026-09-21T00:00:00.000Z",
    channel: "card",
    currency: "NGN",
    ip_address: null,
    metadata,
    log,
    fees: 1000,
    customer,
    authorization,
    plan: null,
  },
});

const recipient = (metadata: unknown) => ({
  active: true,
  createdAt: "2026-09-21T00:00:00.000Z",
  currency: "NGN",
  description: "",
  domain: "test",
  email: "ada@example.com",
  id: 1,
  integration: 1,
  metadata,
  name: "ADA OKONKWO",
  recipient_code: "RCP_x",
  type: "nuban",
  updatedAt: "2026-09-21T00:00:00.000Z",
  is_deleted: false,
  details: {
    authorization_code: null,
    account_number: "0123456789",
    account_name: "ADA OKONKWO",
    bank_code: "058",
    bank_name: "GTBank",
  },
});

const transfer = (recipientMetadata: unknown, sourceDetails: unknown) => ({
  event: "transfer.success",
  data: {
    amount: 100000,
    createdAt: "2026-09-21T00:00:00.000Z",
    currency: "NGN",
    domain: "test",
    failures: null,
    id: 1,
    integration: { id: 1, is_live: false, business_name: "Fixam" },
    reason: null,
    reference: "fixam-transfer",
    source: "balance",
    source_details: sourceDetails,
    status: "success",
    titan_code: null,
    transfer_code: null,
    transferred_at: null,
    updatedAt: "2026-09-21T00:00:00.000Z",
    recipient: recipient(recipientMetadata),
    session: { id: 1, provider: null },
    fee_charged: 100,
    gateway_response: null,
  },
});

const refund = (status: string) => ({
  event: "refund.processed",
  data: {
    status,
    transaction_reference: "fixam-abc",
    refund_reference: "REF_x",
    amount: 1000,
    currency: "NGN",
    processor: "paystack",
    customer: {
      first_name: "Ada",
      last_name: "Okonkwo",
      email: "ada@example.com",
    },
    integration: 1,
    domain: "test",
  },
});

describe("EventDataSchema", () => {
  describe("charge.success", () => {
    /**
     * The regression this suite exists for. The schema used to declare
     * `metadata` as `z.object({})`, which *strips* rather than rejects: the
     * parse succeeded and handed back `{}`, so metadata passed in by the
     * caller was unreachable on the way out.
     */
    it("preserves object metadata instead of stripping it", () => {
      const metadata = {
        type: "credit_purchase",
        userId: "A8t0yDvIX7oTFITeD5gAJrA4evvhIQQG",
        credits: 1000,
      };
      const parsed = EventDataSchema.safeParse(charge(metadata));

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "charge.success") return;
      expect(parsed.data.data.metadata).toEqual(metadata);
    });

    it("preserves metadata keys it does not know about", () => {
      const parsed = EventDataSchema.safeParse(
        charge({ anything: { nested: true }, count: 3 }),
      );

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "charge.success") return;
      expect(parsed.data.data.metadata).toEqual({
        anything: { nested: true },
        count: 3,
      });
    });

    // Paystack types this field as `object | number`, so a numeric value is
    // legal and must not reject the whole event.
    it("accepts numeric metadata", () => {
      const parsed = EventDataSchema.safeParse(charge(7));
      expect(parsed.success).toBe(true);
    });

    it("accepts null and absent metadata", () => {
      expect(EventDataSchema.safeParse(charge(null)).success).toBe(true);
      expect(EventDataSchema.safeParse(charge(undefined)).success).toBe(true);
    });

    it("accepts a charge with a null attempt log", () => {
      // Paystack nulls `log` entirely for a charge that never recorded an
      // attempt log. Declared required, this rejected a live payment.
      const payload = charge({});
      const parsed = EventDataSchema.safeParse({
        ...payload,
        data: { ...payload.data, log: null },
      });

      expect(parsed.success).toBe(true);
    });

    it("rejects a charge with no amount", () => {
      const payload = charge({});
      // @ts-expect-error deliberately violating the payload shape
      delete payload.data.amount;
      expect(EventDataSchema.safeParse(payload).success).toBe(false);
    });
  });

  describe("transfer.success", () => {
    /**
     * `RecipientSchema.metadata` used to require `userId` and `walletId`.
     * A recipient created without those keys failed the whole event — and
     * `transfer.success` is what marks an escrow released, so a strict
     * schema there could strand a payout.
     */
    it("accepts a recipient whose metadata is empty", () => {
      const parsed = EventDataSchema.safeParse(transfer({}, null));
      expect(parsed.success).toBe(true);
    });

    it("accepts a recipient whose metadata has unrelated keys", () => {
      const parsed = EventDataSchema.safeParse(
        transfer({ userId: "u1", walletId: "w1", extra: "kept" }, null),
      );

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "transfer.success") return;
      expect(parsed.data.data.recipient.metadata).toEqual({
        userId: "u1",
        walletId: "w1",
        extra: "kept",
      });
    });

    it("accepts null recipient metadata", () => {
      expect(EventDataSchema.safeParse(transfer(null, null)).success).toBe(
        true,
      );
    });

    it("preserves source_details contents", () => {
      const parsed = EventDataSchema.safeParse(
        transfer(null, { source: "balance", nested: { a: 1 } }),
      );

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "transfer.success") return;
      expect(parsed.data.data.source_details).toEqual({
        source: "balance",
        nested: { a: 1 },
      });
    });
  });

  describe("refund.processed", () => {
    // Paystack reports a refund as pending -> processing -> processed, which
    // is why the enum has to include every stage and not just success/failed.
    it.each(["processed", "processing", "pending", "success", "failed"])(
      "accepts status %s",
      (status) => {
        expect(EventDataSchema.safeParse(refund(status)).success).toBe(true);
      },
    );
  });

  describe("paymentrequest.success", () => {
    it("preserves metadata instead of stripping it", () => {
      const metadata = { orderId: "ORD-1", tags: ["a", "b"] };
      const parsed = EventDataSchema.safeParse({
        event: "paymentrequest.success",
        data: {
          id: 1,
          domain: "test",
          amount: 5000,
          currency: "NGN",
          due_date: null,
          has_invoice: false,
          invoice_number: null,
          description: null,
          pdf_url: null,
          line_items: [],
          tax: [],
          request_code: "PRQ_x",
          status: "success",
          paid: true,
          paid_at: "2026-09-21T00:00:00.000Z",
          metadata,
          notifications: [],
          offline_reference: "x",
          customer: 1,
          created_at: "2026-09-21T00:00:00.000Z",
        },
      });

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "paymentrequest.success") {
        return;
      }
      expect(parsed.data.data.metadata).toEqual(metadata);
    });
  });

  describe("dedicatedaccount.assign.success", () => {
    const fullCustomer = {
      ...customer,
      international_format_phone: "+2348012345678",
    };

    const assigned = {
      event: "dedicatedaccount.assign.success",
      data: {
        customer: fullCustomer,
        dedicated_account: {
          bank: { name: "Wema Bank", id: 20, slug: "wema-bank" },
          account_name: "FIXAM / ADA",
          account_number: "0123456789",
          assigned: true,
          currency: "NGN",
          metadata: { data: { walletId: "w1", extra: "kept" } },
          active: true,
          id: 1,
          created_at: "2026-09-21T00:00:00.000Z",
          updated_at: "2026-09-21T00:00:00.000Z",
          assignment: {
            integration: 1,
            assignee_id: 1,
            assignee_type: "Customer",
            expired: false,
            account_type: "dedicated",
            assigned_at: "2026-09-21T00:00:00.000Z",
            expired_at: null,
          },
        },
      },
    };

    it("preserves dedicated account metadata including siblings of data", () => {
      const parsed = EventDataSchema.safeParse(assigned);

      expect(parsed.success).toBe(true);
      if (
        !parsed.success ||
        parsed.data.event !== "dedicatedaccount.assign.success"
      ) {
        return;
      }
      expect(parsed.data.data.dedicated_account.metadata).toEqual({
        data: { walletId: "w1", extra: "kept" },
      });
    });

    it("preserves customer metadata keys beyond data", () => {
      const parsed = EventDataSchema.safeParse({
        ...assigned,
        data: {
          ...assigned.data,
          customer: {
            ...fullCustomer,
            metadata: { data: { a: 1 }, sibling: "kept" },
          },
        },
      });

      expect(parsed.success).toBe(true);
      if (
        !parsed.success ||
        parsed.data.event !== "dedicatedaccount.assign.success"
      ) {
        return;
      }
      expect(parsed.data.data.customer.metadata).toEqual({
        data: { a: 1 },
        sibling: "kept",
      });
    });
  });

  describe("real payloads", () => {
    /**
     * Captured from `GET /transaction/verify/:reference` for a live test-mode
     * charge. Paystack nulled the customer's name and phone, omitted
     * `log.authentication` entirely, and nulled `authorization.account_name`.
     * The schema declared all five as required strings, so this payload - a
     * genuinely successful charge - was rejected outright.
     */
    it("parses a live charge.success payload with nulls and an absent key", () => {
      const parsed = EventDataSchema.safeParse({
        event: "charge.success",
        data: {
          id: 401638395,
          domain: "test",
          status: "success",
          reference: "fixam-63f30b26-cdda-45f5-beea-737340bb072c",
          amount: 10000000,
          message: null,
          gateway_response: "Successful",
          paid_at: "2026-09-21T10:04:58.000Z",
          created_at: "2026-09-21T10:04:58.000Z",
          channel: "card",
          currency: "NGN",
          ip_address: null,
          metadata: {
            userId: "A8t0yDvIX7oTFITeD5gAJrA4evvhIQQG",
            credits: 1000,
            reference: "fixam-63f30b26-cdda-45f5-beea-737340bb072c",
          },
          log: {
            time_spent: 4,
            attempts: 1,
            errors: 0,
            success: true,
            mobile: false,
            input: [],
            history: [
              {
                type: "action",
                message: "Attempted to pay with card",
                time: 3,
              },
              {
                type: "success",
                message: "Successfully paid with card",
                time: 4,
              },
            ],
          },
          fees: 160000,
          customer: {
            id: 401638395,
            first_name: null,
            last_name: null,
            email: "tradesman@example.com",
            customer_code: "CUS_nwsrqn2ppg6ajbx",
            phone: null,
            metadata: null,
            risk_action: "default",
          },
          authorization: {
            authorization_code: "AUTH_u565egyqob",
            bin: "408408",
            last4: "4081",
            exp_month: "12",
            exp_year: "2030",
            card_type: "visa",
            bank: "TEST BANK",
            country_code: "NG",
            brand: "visa",
            account_name: null,
          },
          plan: null,
        },
      });

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "charge.success") return;
      expect(parsed.data.data.reference).toBe(
        "fixam-63f30b26-cdda-45f5-beea-737340bb072c",
      );
      expect(parsed.data.data.metadata).toEqual({
        userId: "A8t0yDvIX7oTFITeD5gAJrA4evvhIQQG",
        credits: 1000,
        reference: "fixam-63f30b26-cdda-45f5-beea-737340bb072c",
      });
    });

    /**
     * Captured from `GET /refund` for a live test-mode refund. Paystack's
     * refund object carries no `refund_reference` and no `processor` — both
     * were declared required, so every real refund was rejected.
     */
    it("parses a live refund.processed payload with no refund_reference", () => {
      const parsed = EventDataSchema.safeParse({
        event: "refund.processed",
        data: {
          integration: 1581457,
          transaction: 6568094692,
          dispute: null,
          settlement: null,
          id: 18315169,
          domain: "test",
          currency: "NGN",
          amount: 1500000,
          status: "processed",
          refunded_at: "2026-09-17T15:30:03.000Z",
          refunded_by: "gmail",
          deducted_amount: 1500000,
          fully_deducted: 1,
          createdAt: "2026-09-17T15:02:16.000Z",
          bank_reference: null,
          transaction_reference: "dmyo8iphqkb6xox",
          reason: "PROCESSED",
          customer: {
            id: 400689365,
            first_name: null,
            last_name: null,
            email: "client@example.com",
            customer_code: "CUS_ryaovpb4qs9btyb",
            phone: null,
            metadata: null,
            risk_action: "default",
            international_format_phone: null,
          },
          initiated_by: "gmail",
          refund_type: "Full",
          transaction_amount: 1500000,
          refund_channel: "Original Payment",
          session_id: null,
          retriable: false,
        },
      });

      expect(parsed.success).toBe(true);
      if (!parsed.success || parsed.data.event !== "refund.processed") return;
      expect(parsed.data.data.transaction_reference).toBe("dmyo8iphqkb6xox");
    });
  });

  describe("discrimination", () => {
    it("rejects an event it does not model", () => {
      const parsed = EventDataSchema.safeParse({
        event: "some.unmodelled.event",
        data: {},
      });

      expect(parsed.success).toBe(false);
    });

    it("narrows data to the matched event", () => {
      const parsed = EventDataSchema.safeParse(charge({ type: "x" }));

      expect(parsed.success).toBe(true);
      if (!parsed.success) return;

      // Only the charge.success variant carries `reference`.
      switch (parsed.data.event) {
        case "charge.success":
          expect(typeof parsed.data.data.reference).toBe("string");
          break;
        case "transfer.success":
          expect(typeof parsed.data.data.transfer_code).toBe("object");
          break;
        default:
          break;
      }
    });
  });
});
