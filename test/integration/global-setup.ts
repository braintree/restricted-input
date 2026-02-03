/* eslint-disable no-console */
import { startBrowserStackLocal } from "./browserstack-local";

module.exports = async () => {
  if (process.env.CI) {
    console.log("Running in CI - BrowserStack Local managed by GitHub Action");
    return;
  }

  if (
    process.env.BROWSERSTACK_USERNAME &&
    process.env.BROWSERSTACK_ACCESS_KEY
  ) {
    await startBrowserStackLocal();
  } else {
    console.log("Skipping BrowserStack Local - credentials not set");
  }
};
