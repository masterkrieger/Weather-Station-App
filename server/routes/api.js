/*
 * Author: Jeremy Barr
 * Date Created: 16-Aug-2024
 * Description: MEAN Stack Server API to access Weather Database data.
 * Version: 3.0
*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// require WeatherSchema
const Weather = require('../models/weather-schema');

//const API = 'mongodb://localhost:27017/weatherdb';
const API = 'mongodb://localhost:27017/weatherdb';
mongoose.connect(API)   
  .then(()=>{
    console.log("DB connection successful.");
  })
  .catch((err)=>{
    console.log(`DB connection error:${err}`);
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

// Calculate Dewpoint in Celcius and Fahrenheit
// Calculations: https://cals.arizona.edu/azmet/dewpoint.html
// Code modified from https://learn.sparkfun.com/tutorials/weather-station-wirelessly-connected-to-wunderground/all
function getDewpoint(tempc, humidity) {
  var L = Math.log(humidity / 100.0);
  var M = 17.27 * tempc;
  var N = 237.3 + tempc;
  var B = (L + (M / N)) / 17.27;
  var dewPoint = (237.3 * B) / (1.0 - B);
  
  return dewPoint;
}

/******************************
 POST Requests
******************************/
router.post('/weather', async (req, res) => {
  try {
    // add the current timestamp with the javascript Date() function
    req.body.timestamp = new Date().toISOString();

    //console.log(req.body);

    // get dewpoint
    var dewPoint = getDewpoint(req.body.tempc, req.body.humidity);

    //Result is in C (4 decimal places)
    req.body.dewptc = dewPoint.toFixed(4)
    //Convert back to F (4 decimal places)
    req.body.dewptf = dewPoint * 9 / 5.0 + 32;
    req.body.dewptf = req.body.dewptf.toFixed(4);

    Weather.create(req.body, (err) => {
      if (err) return handleError(err)
    })

    res.json(req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server: Error Posting data' });
  }
  
});


/******************************
 GET Requests
******************************/

/* Get api listening */
router.get('/', (res) => {
  res.send('api works');
});

// Get ALL weather data points
router.get('/weather', async (req, res) => {
  try {
    // Get weather data from the Database
    const weatherData = await Weather.find({}, 'station_id timestamp tempf dewptf _id').sort('-timestamp');    

    res.json(weatherData);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server: error getting all weather data' });
  }
});

// Get the specified weather sensor and last number of entries with params in the URL.
router.get('/weather/sensor', async (req, res) => {
  try {
    const sensor = req.query.sensor;
    const timeScale = req.query.timeScale;
    console.log(sensor, timeScale);
    // Get weather data from the Database
    //const sensorData = await Weather.find({}, 'station_id timestamp ' + req.sensor +' -_id'    
    const sensorData = await Weather.find({timestamp: {$gte: timeScale}}, 'station_id timestamp ' + sensor +' -_id'  
    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
    ).sort('-timestamp')
  
    // send response in json format.
    res.json(sensorData);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server: error getting weather data for ' + req.sensor + ' sensor.' });
    }
});

// Get the specified weather sensor and last number of entries.
router.get('/weather/:sensor/:timeScale', async (req, res) => {
  try {
    // Get weather data from the Database
    //const sensorData = await Weather.find({}, 'station_id timestamp ' + req.sensor +' -_id'    
    const sensorData = await Weather.find({timestamp: {$gte: req.timeScale}}, 'station_id timestamp ' + req.sensor +' -_id'  
    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
    ).sort('-timestamp')
  
    // send response in json format.
    res.json(sensorData);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server: error getting weather data for ' + req.sensor + ' sensor.' });
    }
});


/******************************
 Update Requests
******************************/
router.put('/weather/:id', async (req, res) => {
  try {
    // Update weather data in the Database and return the new result {new: true}
    const result = await Weather.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server: error updating weather data' });
  }
});

/******************************
 Delete Requests
******************************/
router.delete('/weather/:id', async (req, res) => {
  try {
    const result = await Weather.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server: error deleting id ' + req.params.id });
  }
});

module.exports = router;
