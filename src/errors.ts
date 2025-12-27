export class PaystackApiError extends Error {
	public status: boolean;
	public override message: string;
	public data: unknown;
	public statusCode: number;

	constructor(
		errorBody: {
			status: boolean;
			message: string;
			data?: unknown;
			statusCode: number;
		},
		options?: ErrorOptions,
	) {
		super(errorBody.message, options);
		this.status = errorBody.status;
		this.message = errorBody.message;
		this.statusCode = errorBody.statusCode;
		this.data = errorBody.data;
		this.name = "PaystackApiError";
	}

	toJSON() {
		return {
			status: this.status,
			message: this.message,
			statusCode: this.statusCode,
			data: this.data,
		};
	}
}
