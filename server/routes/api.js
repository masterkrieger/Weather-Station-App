/*
 * Author: Jeremy Barr
 * Date Created: 26-May-2017
 * Description: MEAN Stack Server API to access Weather Database data.
 * Version: 1.1
 * Updated: 31-Aug-2020
 * Based on the Scotch.io tutorial: https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli
*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const http = require('http');

// require WeatherSchema
const Weather = require('../models/weather-schema');

const API = 'mongodb://localhost:27017/weatherdb';
mongoose.connect(API, {
  useMongoClient: true,
});


/******************************
***** Weather Underground *****
******************************/
const WundergroundHost = "http://rtupdate.wunderground.com/weatherstation/updateweatherstation.php";
const WundergroundID = "";
const WundergroundPassword = "";
const inhgPerPascal = 0.00029529983071445;

/******************************
 POST Requests
******************************/
router.post('/weather', (req, res) => {

  // add the current timestamp with the javascript Date() function
  req.body.timestamp = new Date().toISOString();

  console.log(req.body);

  // Calculate Dewpoint in Celcius and Fahrenheit
  // Calculations: https://cals.arizona.edu/azmet/dewpoint.html
  // Code modified from https://learn.sparkfun.com/tutorials/weather-station-wirelessly-connected-to-wunderground/all
  var L = Math.log(req.body.humidity / 100.0);
  var M = 17.27 * req.body.tempc;
  var N = 237.3 + req.body.tempc;
  var B = (L + (M / N)) / 17.27;
  var dewPoint = (237.3 * B) / (1.0 - B);

  //Result is in C
  req.body.dewptc = dewPoint
  //Convert back to F
  req.body.dewptf = dewPoint * 9 / 5.0 + 32;

  Weather.create(req.body, (err) => {
    
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
  //console.log('sensor = ', req.sensor);
  next();
});

router.param('timeScale', function (req, res, next, timeScale) {
  var now = new Date();
  
  // if the param is not a date string, then assign a date string.
  switch (timeScale) {
    case "day":
      // last 24 hrs from now
      req.timeScale = new Date(now.setHours(now.getHours() - 24)).toISOString();
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
    default:
      // Assign param to the request
      req.timeScale = timeScale;
  }

  // Fetch the timeScale from a database
  //console.log('timeScale = ', req.timeScale);
  next();
});

/******************************
 GET Requests
******************************/

/* Get api listening */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get ALL weather data points
router.get('/weather', (req, res) => {
  // Get weather data from the Database
  Weather.find({}, 'station_id timestamp tempf -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    //groups the weatherData by station_id
    let ngxData = weatherData.reduce((h, data) => Object.assign(h, { [data.station_id]: (h[data.station_id] || []).concat({ name: data.timestamp, value: data.tempf }) }), {});

    //res.json( [{ 'name': 'TempF', 'series': ngxData }] );
    res.json([ngxData]);
  }).sort('-timestamp');
});

// Get the specified weather sensor and last number of entries.
router.get('/weather/:sensor/:timeScale', (req, res) => {

  // Get weather data from the Database
  Weather.find({}, 'station_id timestamp ' + req.sensor +' -_id', (err, weatherData) => {
    if (err)
      res.send(err);
    
    let ngxData = {};

    // if Weather.find() returns an empty object, then return an Object with some name/value 
    if (Object.keys(weatherData).length > 0) {
      // sorts on most recent entries
       ngxData = weatherData.sort((a,b) =>{
          // sort weather on timestamp in ascending order
          return a.timestamp - b.timestamp;
      }).map( data => {
        var now = new Date(data.timestamp);
        var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var day = now.getDate();

        if (hours<10) hours = '0' + hours;
        if (minutes<10) minutes = '0' + minutes;
        if (day<10) day = '0' + day;
        // Readable format timestamp in local time
        var timestamp = hours + ":" + minutes + " " + month[now.getMonth()] + "-" + day;

        return {
          'station_id': data.station_id,
          'timestamp': timestamp,
          'sensor': data[req.sensor]
        };
      // reduce function groups the ngxData by "station_id"
      }).reduce((h, data) => Object.assign(h, { [data.station_id]: (h[data.station_id] || []).concat({ name: data.timestamp, value: data.sensor }) }), {});
    } else {
        ngxData = {
          'name': "null",
          'value': "0.0"
        }
    }   
    // send response in json format.
    res.json([ngxData]);

    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
  }).sort('-timestamp').where('timestamp').gte(req.timeScale);
});

module.exports = router;
