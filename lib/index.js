'use strict';

var path = require('path');
var _ = require('lodash');
var sycle = require('sycle');
var delegate = require('delegates');
var configup = require('configup');

var pathRe = /^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[\\\/])/;

module.exports = function (app, options, done) {
  var c = app.compound || app.copress;
  options = options || {};

  var loadBuiltinModels = options.loadBuiltinModels !== false;
  var sapp = sycle({loadBuiltinModels: loadBuiltinModels});
  var root = sapp.root = c.root;
  var env = app.get('env');
  app.sapp = sapp;
  sapp.app = app;

  delegate(app, 'sapp')
    .method('rekuest')
    .method('model')
    .access('models');

  delegate(sapp, 'app')
    .method('set');

  // load models
  var models = options.models || [path.resolve(root, 'config')];
  if (!Array.isArray(models)) models = [models];
  _.forEach(models, function (m) {
    var x = pathRe.test(m) ? path.resolve(root, 'config', m) : m;
    sapp.phase(sycle.boot.models(x));
  });

  // enable auth
  if (options.auth) {
    sapp.enableAuth();
  }

  // load database settings
  var databasesConfigFile = path.resolve(root, 'config/databases');
  if (!configup.hasConfigFiles(databasesConfigFile, env)) {
    console.log('Could not load config/databases.json');
    throw new Error('Could not load config/databases.json');
  }
  var settings = configup.loadDeepMerge(databasesConfigFile, env);
  sapp.phase(sycle.boot.database(settings));

  // boot sycle app
  sapp.boot(done);
};
