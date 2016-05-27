'use strict';

var express = require('express');
var path = require('path');
var app = express();
var DEFAULT_PORT = 3099;

app.use('/jsdoc', express.static(path.resolve('jsdoc')));
app.use(express.static(path.resolve('dist')));
app.use(express.static(path.resolve('test/support')));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || DEFAULT_PORT, function () {
  var message = '\n App running on ' + this.address().port + ' \n';

  console.log(message);
});
