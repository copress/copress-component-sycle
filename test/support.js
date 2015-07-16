"use strict";

var copress = require('copress');

exports.createApp = function createApp(options) {
  return copress.createServer(options);
};

