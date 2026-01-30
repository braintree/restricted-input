import { defineConfig, devices } from "@playwright/test";

module.exports = defineConfig({
  testDir: "./test/integration",
  testMatch: "**/restricted-input.spec.ts",
  fullyParallel: true,
  retries: 2,
  workers: 1,
  reporter: [["list"]],
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3099",
    trace: "on-first-retry",
    actionTimeout: 10000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "edge",
      use: { ...devices["Desktop Edge"] },
    },
  ],
  webServer: {
    command: "npm start",
    url: "http://localhost:3099",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
