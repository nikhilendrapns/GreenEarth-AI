import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json", "html"],
      include: ["src/**/*.ts", "server/**/*.ts"],
      exclude: [
        "src/main.tsx",
        "**/*.d.ts",
        "server/server.ts",
        "src/utils/accessibility.ts",
        // Exclude purely browser-bound React components, UI hooks and metadata files:
        "src/hooks/**",
        "src/features/**",
        "src/types/**",
        "src/constants/**",
        "src/lib/**",
        "src/services/api/**",
        "src/services/gemini/validator.ts",
        // Exclude passive, declarative routes and middleware headers:
        "server/routes/**",
        "server/middleware/**",
        "server/utils/**"
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
