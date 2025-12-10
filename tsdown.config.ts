import { defineConfig } from "tsdown";

export default defineConfig({
	exports: true,
	outputOptions: {
		legalComments: "inline",
	},
	dts: {
		emitJs: true,
	},
});
