module.exports = function (config) {
  config.set({
    basePath: "../",
    frameworks: ["browserify", "mocha", "chai-sinon"],
    autoWatch: true,
    browsers: ["PhantomJS"],

    plugins: [
      "karma-mocha",
      "karma-browserify",
      "karma-phantomjs-launcher",
      "karma-mocha-reporter",
      "karma-chai-sinon",
    ],

    port: 7357,
    reporters: ["mocha"],
    preprocessors: {
      "test/unit/**/*.js": ["browserify"],
    },
    browserify: {
      extensions: [".js", ".json"],
      ignore: [],
      watch: true,
      debug: true,
      noParse: [],
    },
    files: ["test/unit/**/*.js"],
    exclude: ["**/*.swp"],
    client: {
      captureConsole: true,
    },
  });
};
