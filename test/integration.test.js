'use strict';

var path = require('path');
var s = require('./support');
var t = require('chai').assert;

var SIMPLE_APP = path.resolve(__dirname, 'fixtures', 'simple-app');

describe('copress-component-sycle', function () {
  it('should setup component', function (done) {
    var app = s.createApp(SIMPLE_APP);
    var compound = app.compound;
    compound.boot(function (err) {
      if (err) return done(err);
      t.ok(app.model('Coffee'));
      done();
    });
  });
});
