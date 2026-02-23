/* eslint-disable no-console */
import browserstack from "browserstack-local";

const localIdentifier =
  process.env.BROWSERSTACK_LOCAL_IDENTIFIER || "restricted-input-local";
let bsLocal: browserstack.Local | null = null;

export function startBrowserStackLocal(): Promise<void> {
  return new Promise((resolve, reject) => {
    bsLocal = new browserstack.Local();

    const bsLocalArgs = {
      key: process.env.BROWSERSTACK_ACCESS_KEY ?? "",
      localIdentifier,
      forcelocal: "true",
    };

    console.log("Connecting BrowserStack Local...");
    bsLocal.start(bsLocalArgs, (error) => {
      if (error) {
        console.error("Error starting BrowserStack Local:", error);
        return reject(error);
      }
      console.log(
        `BrowserStack Local connected with localIdentifier=${localIdentifier}`,
      );
      return resolve();
    });
  });
}

export function stopBrowserStackLocal(): Promise<void> {
  return new Promise((resolve) => {
    if (bsLocal) {
      console.log("Stopping BrowserStack Local...");
      bsLocal.stop(() => {
        console.log("BrowserStack Local stopped");
        resolve();
      });
    } else {
      resolve();
    }
  });
}

export function getLocalIdentifier(): string {
  return localIdentifier;
}
