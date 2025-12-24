export class PaystackApiError extends Error {
	public status: boolean;
	public override message: string;
	public data: unknown;

	constructor(errorBody: { status: boolean; message: string; data?: unknown }, options?: ErrorOptions) {
		super(errorBody.message, options);
		this.status = errorBody.status;
		this.message = errorBody.message;
		this.data = errorBody.data;
		this.name = "PaystackApiError";
	}
}
