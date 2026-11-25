import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

//unit tests run in jsdom, a browser copy in Node
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
