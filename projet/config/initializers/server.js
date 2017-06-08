var express = require('express');
var path = require('path');
var apiResponse = require('../../lib/apiResponse.js');
var errorService = require('../../lib/errorService.js');
var fileUpload = require('express-fileupload');
// Local dependecies
var fs = require("fs");
require('dotenv').config({path: 'projet/.env'});
var changeCase = require('change-case');

// create the express app
// configure middlewares
var bodyParser = require('body-parser');
var morgan = require('morgan');
var logger = require('winston');
var app;

var start =  function(cb, db) {
  'use strict';
  // Configure express
  app = express();

  app.use(morgan('common'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json({limit: '2mb'}));
  app.use(express.static(__dirname + '/../../public'));
  app.use(fileUpload());
  app.use(function(req, res, next){
    res.db = db;
    next();
  });

  //Initialize routes
  logger.info('[SERVER] Initializing routes');
  var routesPath = __dirname + "/../../app/routes/";
  fs
    .readdirSync(routesPath)
    .filter(function(file) {
        return (file.indexOf(".") !== 0);
    })
    .forEach(function(routeFolder) {
        fs
          .readdirSync(routesPath + '/' + routeFolder)
          .filter(function(file) {
              return (file.indexOf('.') != 0 && file == 'router.js');
          })
          .forEach(function(file) {
              var router = express.Router();

              // You can add some middleware here
              // router.use(someMiddleware);

              // Initialize the route to add its functionality to router
              require(routesPath + routeFolder + '/' + file)(router);

              // Add router to the speficied route name in the app
              app.use('/' + changeCase.paramCase(routeFolder), router);
          })
    });
  
  app.use(express.static(path.join(__dirname, 'public')));

  // Error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: (app.get('env') === 'development' ? err : {})
    });
    next(err);
  });

  app.listen(process.env.NODE_PORT);
  logger.info('[SERVER] Listening on port ' + process.env.NODE_PORT);
  
  if (cb) {
    return cb();
  }
};

module.exports = start;