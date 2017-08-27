/*
 * Author: Jeremy Barr
 * Date: 26-May-2017
 * Description: MEAN Stack Server API to access Weather Database data.
 * Version: 1.0
 * Based on the Scotch.io tutorial: https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli
*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// require WeatherSchema
const Weather = require('../models/weather-schema');

const API = 'mongodb://localhost:27017/weatherdb';
mongoose.connect('mongodb://localhost:27017/weatherdb', {
  useMongoClient: true,
});

/******************************
 POST Requests
******************************/
router.post('/weather', (req, res) => {

  // add the current timesstamp with the javascript Date() function
  req.body.timestamp = new Date().toISOString();

  console.log(req.body);

  Weather.create(req.body, (err, post) => {
    
    if (err) return handleError(err)
    
    res.json(req.body);
  })
});

/******************************
 Router Params
******************************/

router.param('sensor', function (req, res, next, sensor) {
  // Fetch the sensor from a database
  req.sensor = sensor;
  console.log('sensor = ', req.sensor);
  next();
});

router.param('timeScale', function (req, res, next, timeScale) {
  // Set current time/date
  var now = new Date();

  switch (timeScale) {
    case "24hr":
      // last 24 hrs from now
      req.timeScale = new Date(now.setHours(now.getHours()- 24)).toISOString();
      break;
    case "week":
      // last 7 days from now
      req.timeScale = new Date(now.setDate(now.getDate() - 7)).toISOString();
      break;
    case "month":
      // last Month from now
      req.timeScale = new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      break;
    case "year":
      // last Year from now
      req.timeScale = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      break;
  }

  // Fetch the timeScale from a database
  console.log('timeScale = ', timeScale, req.timeScale);
  next();
});

/*
router.param('limit', function (req, res, next, limit) {
  // Fetch the limited number of data entries (limit) from a database
  req.limit = limit;
  console.log('limit = ', req.limit);
  next();
});
*/

/******************************
 GET Requests
******************************/

/* Get api listening */
router.get('/', (req, res) => {
  res.send('api works');
});


// Get ALL weather data points
router.get('/weather', (req, res) => {
  var now = new Date();
  console.log(new Date(now.setDate(now.getDate() - 7)).toISOString());
  // Get weather data from the Database
  Weather.find({}, 'timestamp tempf -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    let ngxData = weatherData.map( data => {
      return {
        'name': new Date(data.timestamp),
        'value': data.tempf
      };
    });

    res.json( [{ 'name': 'TempF', 'series': ngxData }] );
  });
});

// Get the specified weather sensor and last number of entries.
router.get('/weather/:sensor/:timeScale', (req, res) => {

  // Get weather data from the Database
  Weather.find({}, 'timestamp ' + req.sensor +' -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    // sorts on most recent entries
    let ngxData = weatherData.sort().map( data => {
      return {
        'name': data.timestamp,
        'value': data[req.sensor]
      };
    });

    // send response in json format.
    res.json( [{ 'name': req.sensor, 'series': ngxData }] );

    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
  }).where('timestamp').gte(req.timeScale).sort('-timestamp');
});

module.exports = router;
