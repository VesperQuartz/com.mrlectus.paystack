import { describe, it, expect } from "vitest";
import { PaystackApiError } from "../src/errors";

describe("PaystackApiError", () => {
	it("should serialize to JSON correctly", () => {
		const errorBody = {
			status: false,
			message: "Something went wrong",
			data: { code: "INVALID_PARAMS" },
		};
		const error = new PaystackApiError(errorBody);

		expect(error.toJSON()).toEqual(errorBody);
		expect(JSON.stringify(error)).toBe(JSON.stringify(errorBody));
	});
});
