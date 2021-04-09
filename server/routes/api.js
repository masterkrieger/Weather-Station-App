/*
 * Author: Jeremy Barr
 * Date Created: 16-Sept-2020
 * Description: MEAN Stack Server API to access Weather Database data.
 * Version: 2.0
 * Based on the Scotch.io tutorial: https://scotch.io/tutorials/mean-app-with-angular-2-and-the-angular-cli
*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// require WeatherSchema
const Weather = require('../models/weather-schema');

const API = 'mongodb://localhost:27017/weatherdb';
mongoose.connect(API, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


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

  //Result is in C (4 decimal places)
  req.body.dewptc = dewPoint.toFixed(4)
  //Convert back to F (4 decimal places)
  req.body.dewptf = dewPoint * 9 / 5.0 + 32;
  req.body.dewptf = req.body.dewptf.toFixed(4);

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
  Weather.find({}, 'station_id timestamp tempf dewptf -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    //groups the weatherData by station_id
    //let ngxData = weatherData.reduce((h, data) => Object.assign(h, { [data.station_id]: (h[data.station_id] || []).concat({ name: data.timestamp, value: data.tempf }) }), {});

    let ngxData = weatherData.map(data => {
      return {
        'station_id': data.station_id,
        'date': data.timestamp,
        'tempf': data.tempf,
        'dewptf': data.dewptf
      };
    });

    res.json(ngxData);
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
        var monthWord = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var monthNum = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var day = now.getDate();
        var year = now.getFullYear();

        if (hours<10) hours = '0' + hours;
        if (minutes<10) minutes = '0' + minutes;
        if (day<10) day = '0' + day;
        // Readable format timestamp in local time
        //var timestamp = hours + ":" + minutes + " " + monthWord[now.getMonth()-1] + "-" + day;
        var timestamp = hours + ":" + minutes + " " + day + "-" + monthNum[now.getMonth() - 1] + "-" + year;
        var stationDate = [data.station_id] + 'timestamp';

        return {
          [stationDate]: timestamp,
          [data.station_id]: data[req.sensor]
        };
      // reduce function groups the ngxData by "station_id"
      })
    } else {
        ngxData = {
          'timestamp': "null",
          'sensor': "0.0"
        }
    }   
    // send response in json format.
    res.json(ngxData);

    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
  }).sort('-timestamp').where('timestamp').gte(req.timeScale);
});

module.exports = router;
