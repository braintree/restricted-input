import { defineConfig, PlaywrightTestProject } from "@playwright/test";
import * as path from "path";
import * as dotenv from "dotenv";

// Load .env from project root
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

let type;
if (!process.env.GITHUB_REF) {
  type = "Local";
} else {
  type = "CI";
}
const build = `"Restricted Input" - ${type} ${Date.now()}`;

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME ?? "";
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY ?? "";

// BrowserStack capabilities
const getCaps = (browser: { browserName: string }): Record<string, string> => {
  const caps = {
    browser:
      browser.browserName === "firefox"
        ? "playwright-firefox"
        : browser.browserName,
    os: "Windows",
    os_version: "10",
    "browserstack.local": "true",
    "browserstack.username": BROWSERSTACK_USERNAME,
    "browserstack.accessKey": BROWSERSTACK_ACCESS_KEY,
    "client.playwrightVersion": "1.57.0",
    "browserstack.debug": "true",
    "browserstack.console": "errors",
    "browserstack.networkLogs": "false",
    build: build,
    project: "Restricted Input",
    name: `Playwright test - ${browser.browserName}`,
  };

  return caps;
};

// Define browser configurations
const browsers = [
  { browserName: "chrome", version: "latest" },
  { browserName: "Edge", version: "latest" },
  { browserName: "firefox", version: "latest" },
];

module.exports = defineConfig({
  testDir: "./",
  testMatch: "**/restricted-input.spec.ts",
  fullyParallel: true,
  retries: process.env.DISABLE_RETRIES ? 0 : 1,
  workers: 4,
  reporter: [["list"], ["html"]],
  timeout: 90000,
  globalSetup: require.resolve("./global-setup"),
  globalTeardown: require.resolve("./global-teardown"),
  use: {
    baseURL: "http://localhost:3099",
    trace: "on-first-retry",
    actionTimeout: 20000,
  },
  projects: browsers.map(
    (browser: { browserName: string; version: string }) => ({
      name: `browserstack-${browser.browserName}`,
      use: {
        browserName:
          browser.browserName === "firefox" ? browser.browserName : "chromium",
        channel: browser.browserName === "edge" ? "msedge" : "chrome",
        connectOptions: {
          wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(
            JSON.stringify(getCaps(browser))
          )}`,
        },
      },
    })
  ) as PlaywrightTestProject[],
  webServer: {
    command: "npm start",
    url: "http://localhost:3099",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
