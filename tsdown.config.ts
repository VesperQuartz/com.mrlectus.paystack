import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  outputOptions: {
    comments: {
      legal: true,
    },
  },
  dts: {
    emitJs: true,
  },
});
