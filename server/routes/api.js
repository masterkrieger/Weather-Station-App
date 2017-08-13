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

/* Get api listening */
router.get('/', (req, res) => {
  res.send('api works');
});

/******************************
 Description: Get ALL weather data points
 Warning: May be a large dataset!
******************************/
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
  });
});

/******************************
 Get last 'n' weather data points
******************************/
router.param(['limit'], function (req, res, next, limit) {
  console.log('limit = ', limit);
  next();
});

router.get('/weather/:limit', (req, res) => {
  // Get weather data from the Database
  Weather.find({}, 'timestamp tempf -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    let ngxData = weatherData.sort().map( data => {
      return {
        'name': data.timestamp,
        'value': data.tempf
      };
    });

    // send response in json format.
    res.json( [{ 'name': 'TempF', 'series': ngxData }] );

    // Limit to 'n' results and '+' converts string to number.
  }).limit(+req.params.limit).sort('-timestamp');
});


module.exports = router;
