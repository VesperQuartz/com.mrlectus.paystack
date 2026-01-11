# Paystack SDK

A fully typed, robust, and easy-to-use TypeScript SDK for interacting with the [Paystack API](https://paystack.com/docs/api/v1).

## Installation

```bash
npm install @mrlectus/paystack
# or
pnpm add @mrlectus/paystack
# or
yarn add @mrlectus/paystack
```

## Usage

### Initialization

You can initialize the `PaystackClient` in two ways:

**1. Using Environment Variables (Recommended)**

Set `PAYSTACK_SECRET` in your environment variables, then initialize without arguments.

```typescript
import { PaystackClient } from "@mrlectus/paystack";

const client = PaystackClient();
```

**2. Passing the Secret Key Directly**

```typescript
import { PaystackClient } from "@mrlectus/paystack";

const client = PaystackClient("YOUR_SECRET_KEY");
```

### Configuration

You can pass an optional configuration object to customize the client's behavior.

```typescript
const client = PaystackClient("YOUR_SECRET_KEY", {
  timeout: 20000, // Request timeout in milliseconds (default: 10000)
  debug: true,    // Enable debug logging for requests (default: false)
});
```

## Error Handling

The SDK throws `PaystackApiError` when the API returns a non-success status code (e.g., 4xx, 5xx) or when the API response indicates failure (`status: false`). You should wrap your API calls in a `try-catch` block to handle these errors gracefully.

```typescript
import { PaystackClient, PaystackApiError } from "@mrlectus/paystack";

const client = PaystackClient();

try {
  const response = await client.transactions.verify({ reference: "invalid-ref" });
  console.log(response.data);
} catch (error) {
  if (error instanceof PaystackApiError) {
    console.error("Paystack API Error:", error.message);
    console.error("Status Code:", error.statusCode); // e.g., 404
    console.error("Error Details:", error.toJSON()); // Full error response from Paystack
  } else {
    console.error("Unexpected Error:", error);
  }
}
```

## Features

The SDK covers the entire Paystack API surface area:

- **Transactions**: Initialize, verify, list, and manage payments.
- **Customers**: Create, validate, and manage customers.
- **Transfers**: Automate sending money to customers.
- **Transfer Recipients**: Manage beneficiaries for transfers.
- **Plans & Subscriptions**: Handle recurring billing and subscription plans.
- **Payment Pages**: Create and manage payment pages.
- **Payment Requests**: Manage payment requests and invoices.
- **Refunds**: Initiate and manage transaction refunds.
- **Disputes**: Handle transaction disputes.
- **Subaccounts**: Manage split payment accounts.
- **Settlements**: Insight into payouts.
- **Dedicated Virtual Accounts**: Manage virtual accounts for customers.
- **Apple Pay**: Manage Apple Pay domain registration.
- **Bulk Charges**: Process batched transactions.
- **Direct Debit**: Manage recurring debits.
- **Terminal & Virtual Terminal**: Manage POS and virtual terminal payments.
- **Verification**: Perform KYC/identity verification (BVN, Account Match, etc).
- **Miscellaneous**: List banks, countries, and states.

## Examples

### Initialize a Transaction

```typescript
import { PaystackClient, PaystackApiError } from "@mrlectus/paystack";

const client = PaystackClient();

try {
  const response = await client.transactions.initialize({
    email: "customer@example.com",
    amount: "5000", // Amount in kobo
    channels: ["card", "bank"],
  });

  console.log("Authorization URL:", response.data.authorization_url);
} catch (error) {
  if (error instanceof PaystackApiError) {
    console.error("Initialization Failed:", error.message);
  }
}
```

### Create a Customer

```typescript
try {
  const customer = await client.customers.create({
    email: "new.user@example.com",
    first_name: "John",
    last_name: "Doe",
    phone: "+2348012345678",
  });

  console.log("Customer ID:", customer.data.id);
} catch (error) {
  if (error instanceof PaystackApiError) {
    console.error("Customer Creation Failed:", error.message);
  }
}
```

### Initiate a Transfer

```typescript
try {
  // 1. Create a recipient
  const recipient = await client.transferRecipients.create({
    type: "nuban",
    name: "Zombie Recipient",
    account_number: "0123456789",
    bank_code: "058",
    currency: "NGN",
  });

  // 2. Initiate transfer
  const transfer = await client.transfers.initiate({
    source: "balance",
    amount: 5000,
    recipient: recipient.data.recipient_code,
    reference: `ref-${Date.now()}`,
    reason: "Holiday Bonus",
  });

  console.log("Transfer status:", transfer.data.status);
} catch (error) {
  if (error instanceof PaystackApiError) {
    console.error("Transfer Failed:", error.message);
  }
}
```

### List Banks

```typescript
try {
  const banks = await client.miscellaneous.listBanks({
    country: "nigeria",
    use_cursor: true,
    perPage: 10,
  });

  console.log("Banks retrieved:", banks.data.length);
} catch (error) {
  console.error("Failed to list banks", error);
}
```

## TypeScript Support

This package is written in TypeScript and ships with type definitions. This means you get autocompletion and type checking for all API payloads and responses, ensuring you integrate with Paystack correctly and efficiently.

## License

MIT
