/* eslint-disable no-console */
import { startBrowserStackLocal } from "./browserstack-local";

module.exports = async () => {
  // Only start BrowserStack Local if credentials are set
  if (
    process.env.BROWSERSTACK_USERNAME &&
    process.env.BROWSERSTACK_ACCESS_KEY
  ) {
    await startBrowserStackLocal();
  } else {
    console.log("Skipping BrowserStack Local - credentials not set");
  }
};
