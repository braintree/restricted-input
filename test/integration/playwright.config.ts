import { defineConfig, PlaywrightTestProject } from "@playwright/test";
import * as path from "path";
import * as dotenv from "dotenv";
import { getLocalIdentifier } from "./browserstack-local";

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

const getCaps = (browser: {
  browserName: string;
  playwrightName?: string;
}): Record<string, string> => {
  const caps = {
    browser: browser.playwrightName
      ? browser.playwrightName
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
    "browserstack.localIdentifier": process.env.BROWSERSTACK_LOCAL_IDENTIFIER
      ? process.env.BROWSERSTACK_LOCAL_IDENTIFIER
      : getLocalIdentifier(),
    build: build,
    project: "Restricted Input",
    name: `Playwright test - ${browser.browserName}`,
  };

  return caps;
};

const browsers = [
  { browserName: "chrome", version: "latest" },
  { browserName: "Edge", version: "latest" },
  {
    browserName: "firefox",
    playwrightName: "playwright-firefox",
    version: "latest",
  },
  {
    browserName: "safari",
    playwrightName: "playwright-webkit",
    version: "latest",
  },
];

module.exports = defineConfig({
  testDir: "./",
  testMatch: "**/restricted-input.spec.ts",
  fullyParallel: true,
  retries: process.env.DISABLE_RETRIES ? 0 : 2,
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
            JSON.stringify(getCaps(browser)),
          )}`,
        },
      },
    }),
  ) as PlaywrightTestProject[],
  webServer: {
    command: "npm start",
    url: "http://localhost:3099",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
