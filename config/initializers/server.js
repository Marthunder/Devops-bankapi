var express = require('express');
var path = require('path');
var apiResponse = require('../../lib/apiResponse.js');
var errorService = require('../../lib/errorService.js');
var fileUpload = require('express-fileupload');
// Local dependecies
var fs = require("fs");
var config = require('nconf');
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

  //Initialize routes
  logger.info('[SERVER] Initializing routes');
  var routesPath = __dirname + "/../../app/routes/";
  fs
    .readdirSync(routesPath)
    .filter(function(file) {
        return (file.indexOf(".") !== 0);
    })
    .forEach(function(file) {
	    var routeName = file.substring(0, file.indexOf('.'));
	    var router = express.Router();

	    // You can add some middleware here 
	    // router.use(someMiddleware);
	    
	    // Initialize the route to add its functionality to router
	    require(routesPath + routeName)(router, db, apiResponse, errorService);
	    
	    // Add router to the speficied route name in the app
	    app.use('/' + changeCase.paramCase(routeName), router);
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

  app.listen(config.get('NODE_PORT'));
  logger.info('[SERVER] Listening on port ' + config.get('NODE_PORT'));
  
  if (cb) {
    return cb();
  }
};

module.exports = start;