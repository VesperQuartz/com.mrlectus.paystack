import type { CustomerMeta } from "../customers";

export type ListMandateAuthorizationsPayload = {
	/** @description The cursor value of the next set of authorizations to fetch. You can get this from the meta object of the response */
	cursor?: string;
	/** @description Filter by the authorization status. Accepted values are: `pending`, `active`, `revoked` */
	status: "active" | "revoked" | "pending";
	/** @description The number of authorizations to fetch per request */
	per_page?: number;
};

export type ListMandateAuthorizationsResponsePayload = {
	status: boolean;
	message: string;
	data: Partial<
		{
			id: number;
			status: "active" | (string & {});
			mandate_id: number;
			authorization_id: number;
			authorization_code: `AUTH_${string}`;
			integration_id: number;
			account_number: string;
			bank_code: string;
			bank_name: string | null;
			authorized_at: string;
			customer: {
				id: number;
				customer_code: `CUS_${string}`;
				email: string;
				first_name: string;
				last_name: string;
			};
		}[]
	>;
	meta: CustomerMeta;
};

export type CreateDirectDebitClient = {};
