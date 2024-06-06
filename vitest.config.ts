/// <reference types="vitest" />
import react from "@vitejs/plugin-react";

import { defineConfig } from "vitest/config";
import { defineConfig as viteDefineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom", // or 'jsdom', if you prefer
    setupFiles: ["./test/setup.ts"], // Optional setup file (see below)
    globals: true, // Makes expect, describe, test, etc. available globally
  },
});
