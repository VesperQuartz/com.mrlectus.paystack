import { z } from "zod/v4-mini";

const RefundSchema = z.object({
  status: z.enum(["success", "failed", "pending"]),
  transaction_reference: z.string(),
  refund_reference: z.string(),
  amount: z.number(),
  currency: z.string(),
  processor: z.string(),
  customer: z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
  }),
  integration: z.number(),
  domain: z.string(),
});

const DetailsSchema = z.object({
  authorization_code: z.nullish(z.string()),
  account_number: z.nullish(z.string()),
  account_name: z.string(),
  bank_code: z.string(),
  bank_name: z.string(),
});

const RecipientSchema = z.object({
  active: z.boolean(),
  createdAt: z.string(),
  currency: z.string(),
  description: z.string(),
  domain: z.string(),
  email: z.nullish(z.email()),
  id: z.number(),
  integration: z.number(),
  metadata: z.nullish(
    z.object({
      userId: z.string(),
      walletId: z.string(),
    }),
  ),
  name: z.string(),
  recipient_code: z.string(),
  type: z.string(),
  updatedAt: z.string(),
  is_deleted: z.boolean(),
  details: DetailsSchema,
});

const IntegrationSchema = z.object({
  id: z.number(),
  is_live: z.boolean(),
  business_name: z.string(),
  logo_path: z.optional(z.string()),
});

const TransferSchema = z.object({
  amount: z.number(),
  createdAt: z.string(),
  currency: z.string(),
  domain: z.string(),
  failures: z.nullish(z.array(z.any())),
  id: z.number(),
  integration: IntegrationSchema,
  reason: z.nullish(z.string()),
  reference: z.string(),
  source: z.string(),
  source_details: z.nullish(z.object({})),
  status: z.enum(["success", "pending", "failed", "reversed"]),
  titan_code: z.nullish(z.string()),
  transfer_code: z.nullish(z.string()),
  transferred_at: z.nullish(z.string()),
  updatedAt: z.string(),
  recipient: RecipientSchema,
  session: z.object({
    id: z.any(),
    provider: z.any(),
  }),
  fee_charged: z.number(),
  gateway_response: z.nullish(z.string()),
});

const AuthorizationSchema = z.object({
  authorization_code: z.string(),
  bin: z.string(),
  last4: z.string(),
  exp_month: z.string(),
  exp_year: z.string(),
  card_type: z.string(),
  bank: z.string(),
  country_code: z.string(),
  brand: z.string(),
  account_name: z.string(),
});

const CustomerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  customer_code: z.string(),
  phone: z.string(),
  metadata: z.union([
    z.nullish(
      z.object({
        data: z.union([z.record(z.string(), z.any()), z.object({})]),
      }),
    ),
    z.object({}),
  ]),
  risk_action: z.string(),
  international_format_phone: z.string(),
});

const LogSchema = z.object({
  time_spent: z.number(),
  attempts: z.number(),
  authentication: z.string(),
  errors: z.number(),
  success: z.boolean(),
  mobile: z.boolean(),
  input: z.array(z.any()),
  channel: z.nullish(z.string()),
  history: z.array(
    z.object({
      type: z.string(),
      message: z.string(),
      time: z.number(),
    }),
  ),
});

const AssignmentSchema = z.object({
  integration: z.number(),
  assignee_id: z.number(),
  assignee_type: z.string(),
  expired: z.boolean(),
  account_type: z.string(),
  assigned_at: z.string(),
  expired_at: z.nullish(z.string()),
});

const BankSchema = z.object({
  name: z.string(),
  id: z.number(),
  slug: z.string(),
});

const DedicatedAccountSchema = z.object({
  bank: BankSchema,
  account_name: z.string(),
  account_number: z.string(),
  assigned: z.boolean(),
  currency: z.string(),
  metadata: z.nullish(
    z.object({
      data: z.any(),
    }),
  ),
  active: z.boolean(),
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  assignment: AssignmentSchema,
});

const BvnIdentificationSchema = z.object({
  country: z.string(),
  type: z.literal("bvn"),
  value: z.string(),
});

const PaymentRequest = z.object({
  id: z.number(),
  domain: z.string(),
  amount: z.number(),
  currency: z.string(),
  due_date: z.nullish(z.string()),
  has_invoice: z.boolean(),
  invoice_number: z.nullish(z.string()),
  description: z.nullish(z.string()),
  pdf_url: z.nullish(z.string()),
  line_items: z.array(z.any()),
  tax: z.array(z.any()),
  request_code: z.string(),
  status: z.enum(["pending", "success", "failed"]),
  paid: z.boolean(),
  paid_at: z.nullish(z.string()),
  metadata: z.nullish(z.object({})),
  notifications: z.array(
    z.nullish(
      z.object({
        sent_at: z.string(),
        channel: z.string(),
      }),
    ),
  ),
  offline_reference: z.string(),
  customer: z.number(),
  created_at: z.string(),
});

const TransferSuccessfulSchema = z.object({
  event: z.literal("transfer.success"),
  data: TransferSchema,
});

const BankAccountIdentificationSchema = z.object({
  country: z.string(),
  type: z.literal("bank_account"),
  bvn: z.string(),
  account_number: z.string(),
  bank_code: z.string(),
});

const CustomerIdentificationFailedSchema = z.object({
  event: z.literal("customeridentification.failed"),
  data: z.object({
    customer_id: z.number(),
    customer_code: z.string(),
    email: z.email(),
    identification: BankAccountIdentificationSchema,
    reason: z.string(),
  }),
});

const TransactionSuccessSchema = z.object({
  event: z.literal("charge.success"),
  data: z.object({
    id: z.number(),
    domain: z.string(),
    status: z.enum(["success", "pending", "failed"]),
    reference: z.string(),
    amount: z.number(),
    message: z.nullish(z.string()),
    gateway_response: z.string(),
    paid_at: z.string(),
    created_at: z.string(),
    channel: z.string(),
    currency: z.string(),
    ip_address: z.nullish(z.string()),
    metadata: z.union([z.nullish(z.object({})), z.number()]),
    log: LogSchema,
    fees: z.any(),
    customer: z.omit(CustomerSchema, {
      international_format_phone: true,
    }),
    authorization: AuthorizationSchema,
    plan: z.nullish(z.object({})),
  }),
});

const CustomerIdentificationSuccessSchema = z.object({
  event: z.literal("customeridentification.success"),
  data: z.object({
    customer_id: z.string(),
    customer_code: z.string(),
    email: z.email(),
    identification: BvnIdentificationSchema,
  }),
});

const DedicatedAccountAssignSuccessSchema = z.object({
  event: z.literal("dedicatedaccount.assign.success"),
  data: z.object({
    customer: CustomerSchema,
    dedicated_account: DedicatedAccountSchema,
  }),
});

const PaymentRequestSucccessSchema = z.object({
  event: z.literal("paymentrequest.success"),
  data: PaymentRequest,
});

const DedicatedAccountAssignFailedSchema = z.object({
  event: z.literal("dedicatedaccount.assign.failed"),
  data: z.object({
    customer: CustomerSchema,
    dedicated_account: z.null(),
  }),
});

const PaymentRequestPendingSchema = z.object({
  event: z.literal("paymentrequest.pending"),
  data: PaymentRequest,
});

const RefundPendingSchema = z.object({
  event: z.literal("refund.pending"),
  data: RefundSchema,
});

const RefundProcessedSchema = z.object({
  event: z.literal("refund.processed"),
  data: RefundSchema,
});

const RefundFailedSchema = z.object({
  event: z.literal("refund.failed"),
  data: RefundSchema,
});

const RefuncProcessingSchema = z.object({
  event: z.literal("refund.processing"),
  data: RefundSchema,
});

const TransferReversedSchema = z.object({
  event: z.literal("transfer.reversed"),
  data: TransferSchema,
});

const TransferFailedSchema = z.object({
  event: z.literal("transfer.failed"),
  data: TransferSchema,
});

export const EventDataSchema = z.discriminatedUnion("event", [
  PaymentRequestSucccessSchema,
  CustomerIdentificationSuccessSchema,
  DedicatedAccountAssignSuccessSchema,
  TransactionSuccessSchema,
  TransferSuccessfulSchema,
  CustomerIdentificationFailedSchema,
  DedicatedAccountAssignFailedSchema,
  PaymentRequestPendingSchema,
  RefundPendingSchema,
  RefundProcessedSchema,
  RefundFailedSchema,
  RefuncProcessingSchema,
  TransferReversedSchema,
  TransferFailedSchema,
]);
