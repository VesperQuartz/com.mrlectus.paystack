export type SendEventPayload =
  | {
      /** The ID of the Terminal the event should be sent to. */
      terminal_id: string;
      /** The type of event to push. We currently support `invoice` and `transaction` */
      type: "invoice";
      /** The action the Terminal needs to perform. For the `invoice` type, the action can either be `process` or `view`. For the transaction type, the action can either be `process` or `print`. */
      action: "process" | "view";
      /** The paramters needed to perform the specified action. For the `invoice` type, you need to pass the invoice id and offline reference: `{id: invoice_id, reference: offline_reference}`. For the transaction type, you can pass the transaction id: `{id: transaction_id}` */
      data: {
        /** Invoice ID */
        id: number;
        /** Offline reference */
        reference: number;
      };
    }
  | {
      /** The ID of the Terminal the event should be sent to. */
      terminal_id: string;
      /** The type of event to push. We currently support `invoice` and `transaction` */
      type: "transaction";
      /** The action the Terminal needs to perform. For the `invoice` type, the action can either be `process` or `view`. For the transaction type, the action can either be `process` or `print`. */
      action: "process" | "print";
      data: {
        /** Transaction ID */
        id: number;
      };
    };

export type SendEventResponsePayload = {
  status: boolean;
  message: string;
  data: {
    id: string;
  };
};

export type FetchEventStatusPayload = {
  /** The ID of the Terminal the event was sent to. */
  terminal_id: string;
  /** The ID of the event that was sent to the Terminal */
  event_id: string;
};

export type FetchEventStatusResponsePayload = {
  status: boolean;
  message: string;
  data: {
    delivered: boolean;
  };
};

export type FetchStatusResponsePayload = {
  status: boolean;
  message: string;
  data: {
    online: boolean;
    available: boolean;
  };
};

export type ListTerminalPayload = {
  /** Filter by status ('active' or 'inactive') */
  status: "active" | "inactive";
  /** Search query string */
  search?: string;
  /** Specify how many records you want to retrieve per page. If not specified, we use a default value of 50. */
  perPage?: number;
  /** A cursor that indicates your place in the list. It can be used to fetch the next page of the list */
  next?: string;
  /** A cursor that indicates your place in the list. It should be used to fetch the previous page of the list after an intial next request */
  previous?: string;
};

export type TerminalData = {
  id: number;
  serial_number: string;
  device_make: string | null;
  terminal_id: string;
  integration: number;
  domain: string;
  name: string;
  address: string | null;
  status: "active" | (string & {});
};

export type TerminalMeta = {
  next: string | null;
  previous: string | null;
  perPage: number;
};

export type ListTerminalResponsePayload = {
  status: boolean;
  message: string;
  data: Partial<TerminalData[]>;
  meta: TerminalMeta;
};

export type FetchTerminalResponsePayload = {
  status: boolean;
  message: string;
  data: TerminalData;
};

export type UpdateTerminalPayload = {
  /** The ID of the Terminal you want to update */
  terminal_id: string;
  /** The name of the Terminal */
  name: string;
  /** The address of the Terminal */
  address: string;
};

export type CreateTerminalClient = {
  /** Send an event from your application to the Paystack Terminal */
  sendEvent: (payload: SendEventPayload) => Promise<SendEventResponsePayload>;
  /** Check the status of an event sent to the Terminal */
  fetchEventStatus: (payload: FetchEventStatusPayload) => Promise<FetchEventStatusResponsePayload>;
  /** Check the availiability of a Terminal before sending an event to it */
  fetchStatus: (payload: { terminal_id: string }) => Promise<FetchStatusResponsePayload>;
  /** List the Terminals available on your integration */
  list: (payload: ListTerminalPayload) => Promise<ListTerminalResponsePayload>;
  /** Get the details of a Terminal */
  fetch: (payload: { terminal_id: string }) => Promise<FetchTerminalResponsePayload>;
  /** Update the details of a Terminal */
  update: (payload: UpdateTerminalPayload) => Promise<{
    status: boolean;
    message: string;
  }>;
  /** Activate your debug device by linking it to your integration */
  commission: (payload: { serial_number: string }) => Promise<{
    status: boolean;
    message: string;
  }>;
  /** Unlink your debug device from your integration */
  decommission: (payload: { serial_number: string }) => Promise<{
    status: boolean;
    message: string;
  }>;
};
