import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.spec.ts", "tests/**/*.spec.ts"],
    exclude: ["dist/**", "node_modules/**"],
  },
  resolve: {
    alias: [
      {
        find: /^(.*)\.js$/,
        replacement: "$1.ts",
      },
    ],
  },
});
