/* eslint-disable no-console */
import { stopBrowserStackLocal } from "./browserstack-local";

module.exports = async () => {
  if (process.env.CI) {
    console.log("Running in CI - BrowserStack Local managed by GitHub Action");
    return;
  }

  await stopBrowserStackLocal();
};
