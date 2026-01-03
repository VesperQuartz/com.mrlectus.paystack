import type { ListTerminalPayload } from "../terminal";
import type { CreateSplit } from "../transaction-splits";
import type { Currency } from "../types";

export type CreateVirtualTerminalPayload = {
  /** @description Name of the Virtual Terminal */
  name: string;
  /** @description An array of objects containing the notification recipients for payments to the Virtual Terminal. Each object includes a `target` parameter for the Whatsapp phone number to send notifications to, and a `name` parameter for a descriptive label. */
  destinations: {
    target: string;
    name: string;
  }[];
  /** @description Stringified JSON object of custom data. Kindly check the Metadata page for more information */
  metadata: string[];
  /** @description The transaction currency for the Virtual Terminal. Defaults to your integration currency */
  currency?: Currency[];
  /** @description An array of objects representing custom fields to display on the form. Each object contains a `display_name` parameter, representing what will be displayed on the Virtual Terminal page, and `variable_name` parameter for referencing the custom field programmatically */
  custom_fields: {
    display_name: string;
    variable_name: string;
  }[];
};

export type Destinations = {
  target: string;
  type: string;
  name: string;
  created_at?: string;
};

export type VirtualTerminal = {
  id: number;
  name: string;
  integration: number;
  created_at?: string;
  domain: string;
  code: string;
  paymentMethods: Partial<unknown[]>;
  active: boolean;
  metadata: unknown | null;
  destinations: Partial<Destinations[]>;
  currency: Currency;
  connect_account_id?: string | null;
};

export type CreateVirtualTerminalResponsePayload = {
  status: boolean;
  message: string;
  data: VirtualTerminal;
};

export type ListVirtualTerminalPayload = {
  /** @description Filter by status ('active' or 'inactive') */
  status: "active" | "inactive";
  /** @description Number of records per page */
  perPage?: number;
  /** @description Search query string */
  search?: string;
  /** @description Cursor for next page */
  next?: string;
  /** @description Cursor for previous page */
  previous?: string;
};

export type VirtualMeta = {
  next: string | null;
  previous: string | null;
  perPage: number;
};

export type ListVirtualTerminalResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<VirtualTerminal[]>;
  meta: VirtualMeta;
};

export type AssignDestinationPayload = {
  /** @description Code of the Virtual Terminal */
  code: string;
  /** @description An array of objects containing the notification recipients for payments to the Virtual Terminal. Each object includes a `target` parameter for the Whatsapp phone number to send notifications to, and a `name` parameter for a descriptive label. */
  destinations: Omit<Destinations, "created_at" | "type">[];
};

export type AssignDestinationResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<
    {
      integration: number;
      target: string;
      name: string;
      type: string;
      id: number;
      createdAt: string;
      updatedAt: string;
    }[]
  >;
};

export type UnAssignDestinationPayload = {
  /** @description Code of the Virtual Terminal */
  code: string;
  /** @description Array of destination targets to unassign */
  targets: string[];
};

export type AddSplitCodePayload = {
  /** @description Code of the Virtual Terminal */
  code: string;
  /** @description Split code to be added or removed from Virtual Terminal */
  split_code: string;
};

export type AddSplitCodeResponsePayload = {
  status: boolean;
  message: string;
  data: CreateSplit;
};

export type CreateVirtualTerminalClient = {
  /**
   * @description Create a Virtual Terminal on your integration
   */
  create: (payload: CreateVirtualTerminalPayload) => Promise<CreateVirtualTerminalResponsePayload>;

  /**
   * @description List the Virtual Terminals available on your integration
   */
  list: (payload: ListTerminalPayload) => Promise<ListVirtualTerminalResponsePayload>;

  /**
   * @description Fetch a Virtual Terminal on your integration
   */
  fetch: (payload: {
    /**
     * @description Code of the Virtual Terminal
     */
    code: string;
  }) => Promise<CreateVirtualTerminalResponsePayload>;

  /**
   * @description Update a Virtual Terminal on your integration
   */
  update: (payload: {
    /**
     * @description Code of the Virtual Terminal to update
     */
    code: string;
    /**
     * @description Name of the Virtual Terminal
     */
    name: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * @description Deactivate a Virtual Terminal on your integration
   */
  deactivate: (payload: {
    /**
     * @description Code of the Virtual Terminal to deactivate
     */
    code: string;
  }) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * @description Add a destination (WhatsApp number) to a Virtual Terminal on your integration
   */
  assignDestination: (
    payload: AssignDestinationPayload,
  ) => Promise<AssignDestinationResponsePayload>;

  /**
   * @description Unassign a destination (WhatsApp Number) summary of transactions from a Virtual Terminal on your integration
   */
  unassignDestination: (payload: UnAssignDestinationPayload) => Promise<{
    status: boolean;
    message: string;
  }>;

  /**
   * @description Add a split code to a Virtual Terminal on your integration
   */
  addSplitCode: (payload: AddSplitCodePayload) => Promise<AddSplitCodeResponsePayload>;

  /**
   * @description Remove a split code from a Virtual Terminal on your integration
   */
  removeSplitCode: (payload: AddSplitCodePayload) => Promise<{
    status: boolean;
    message: string;
  }>;
};
