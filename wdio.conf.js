const uuid = require("uuid").v4;
const browserstack = require("browserstack-local");

// Stop node from complaining about fake memory leaks at higher concurrency
require("events").defaultMaxListeners = 20;
require("dotenv").config();

const ONLY_BROWSERS = process.env.ONLY_BROWSERS;
const localIdentifier = uuid();

const projectName = "Restricted Input";
let type;

if (!process.env.GITHUB_REF) {
  type = "Local";
} else {
  type = "CI";
}
const build = `${projectName} - ${type} ${Date.now()}`;

const desktopCapabilities = {
  "bstack:options": {
    os: "Windows",
    osVersion: "10",
    local: "true",
    debug: "true",
    seleniumVersion: "3.14.0",
    localIdentifier,
  },
  browserVersion: "latest",
};

let capabilities = [
  {
    ...desktopCapabilities,
    browserName: "Chrome",
  },
  {
    ...desktopCapabilities,
    browserName: "Edge",
  },
  {
    ...desktopCapabilities,
    browserName: "Firefox",
  },
  // TODO safari doesn't work on github actions
  // {
  //   ...desktopCapabilities,
  //   browserName: "Desktop Safari",
  //   browser: "safari",
  //   os: "OS X",
  //   os_version: "Mojave",
  // },
];

if (ONLY_BROWSERS) {
  capabilities = ONLY_BROWSERS.split(",").map((browser) =>
    capabilities.find(
      (config) => config.browserName.toLowerCase() === browser.toLowerCase()
    )
  );

  if (capabilities.length === 0) {
    throw new Error(`Could not find browsers ${ONLY_BROWSERS} in config`);
  }
}

const mochaOpts = {
  timeout: 90000,
};

if (!process.env.DISABLE_RETRIES) {
  mochaOpts.retries = 3;
}

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,
  specs: require("fs")
    .readdirSync("./test/integration")
    .map((f) => `./test/integration/${f}`),
  maxInstances: 4,
  capabilities,
  sync: true,
  logLevel: "error",
  deprecationWarnings: true,
  bail: 0,
  waitforTimeout: 20000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  services: [
    [
      "browserstack",
      {
        runner: "local",
        browserstackLocal: true,
      },
    ],
  ],
  framework: "mocha",
  mochaOpts,
  reporters: ["spec"],
  reportOptions: {
    outputDir: "./",
  },
  onPrepare() {
    /* eslint-disable no-console */
    console.log("Connecting local");
    return new Promise((resolve, reject) => {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start(
        {
          key: process.env.BROWSERSTACK_ACCESS_KEY,
          localIdentifier,
        },
        (error) => {
          if (error) return reject(error);
          console.log(`Connected with localIdentifier=${localIdentifier}`);
          console.log(
            "Testing in the following browsers:",
            capabilities
              .map(
                (browser) => `${browser.browserName}@${browser.browserVersion}`
              )
              .join(", ")
          );

          return resolve();
        }
      );
    });
    /* eslint-enable no-console */
  },
  before(capabilities) {
    // Mobile devices/selenium don't support the following APIs yet
    browser.setTimeout({
      pageLoad: 10000,
      script: 5 * 60 * 1000,
    });
  },
  onComplete() {
    exports.bs_local.stop(() => {});
  },
};
