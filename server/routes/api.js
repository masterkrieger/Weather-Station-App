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
mongoose.connect(API, {
  useMongoClient: true,
});

/******************************
 POST Requests
******************************/
router.post('/weather', (req, res) => {

  // add the current timestamp with the javascript Date() function
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
  var now = new Date();
  
  // if the param is not a date string, then assign a date string.
  switch (timeScale) {
    case "day":
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
    default:
      // Assign param to the request
      req.timeScale = timeScale;
  }

  // Fetch the timeScale from a database
  console.log('timeScale = ', req.timeScale);
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
  Weather.find({}, 'timestamp tempf -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    let ngxData = weatherData.map( data => {
      return {
        'name': data.timestamp,
        'value': data.tempf
      };
    });

    res.json( [{ 'name': 'TempF', 'series': ngxData }] );
  }).sort('-timestamp');
});

// Get the specified weather sensor and last number of entries.
router.get('/weather/:sensor/:timeScale', (req, res) => {

  // Get weather data from the Database
  Weather.find({}, 'timestamp ' + req.sensor +' -_id', (err, weatherData) => {
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
        var month = ["Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var day = now.getDate();

        if (hours<10) hours = '0' + hours;
        if (minutes<10) minutes = '0' + minutes;
        if (day<10) day = '0' + day;
        // Readable format timestamp in local time
        var timestamp = hours + ":" + minutes + " " + month[now.getMonth()-1] + "-" + day;

        return {
          'name': timestamp,
          'value': data[req.sensor]
        };
      });
    } else {
        ngxData = {
          'name': "null",
          'value': "0.0"
        }
    }


    // send response in json format.
    res.json( [{ 'name': req.sensor, 'series': ngxData }] );

    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
  }).sort('-timestamp').where('timestamp').gte(req.timeScale);
});

module.exports = router;
