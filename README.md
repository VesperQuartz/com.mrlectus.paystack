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
const response = await client.transactions.initialize({
  email: "customer@example.com",
  amount: "5000", // Amount in kobo (or subunit of currency)
  channels: ["card", "bank"],
});

console.log(response.data.authorization_url);
```

### Verify a Transaction

```typescript
const response = await client.transactions.verify({
  reference: "T1234567890",
});

if (response.data.status === "success") {
  console.log("Payment successful!");
}
```

### Create a Customer

```typescript
const customer = await client.customers.create({
  email: "new.user@example.com",
  first_name: "John",
  last_name: "Doe",
  phone: "+2348012345678",
});

console.log("Customer ID:", customer.data.id);
```

### Initiate a Transfer

```typescript
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
```

### List Banks

```typescript
const banks = await client.miscellaneous.listBanks({
  country: "nigeria",
  use_cursor: true,
  perPage: 10,
});

console.log(banks.data);
```

## TypeScript Support

This package is written in TypeScript and ships with type definitions. This means you get autocompletion and type checking for all API payloads and responses, ensuring you integrate with Paystack correctly and efficiently.

## License

MIT