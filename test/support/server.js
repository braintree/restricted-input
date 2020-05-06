/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const path = require("path");
const app = express();
const DEFAULT_PORT = 3099;

app.use("/jsdoc", express.static(path.resolve("jsdoc")));
app.use(express.static(path.resolve("dist-app")));
app.use(express.static(path.resolve("test/support")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(process.env.PORT || DEFAULT_PORT, function () {
  const message = "\n App running on " + this.address().port + " \n";

  console.log(message);
});
