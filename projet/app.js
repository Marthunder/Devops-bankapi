'use strict';

var server = require('./config/initializers/server');
var nconf = require('nconf');
var async = require('async');
var logger = require('winston');
var db = {};

// Load Environment variables from .env file
require('dotenv').load();

// Set up configs
nconf.use('memory');
// First load command line arguments
nconf.argv();
// Load environment variables
nconf.env();

logger.info('[APP] Starting server initialization');

// Initialize Modules
async.series([
  function initializeDBConnection(callback) {
    require('./config/initializers/database')(function(err, dbResult) {
		db = dbResult;
		callback();
    });
  },
  function startServer(callback) {
    server(callback, db);
  }], function(err) {
    if (err) {
      logger.error('[APP] initialization failed', err);
    } else {
      logger.info('[APP] initialized SUCCESSFULLY');
    }
  }
);