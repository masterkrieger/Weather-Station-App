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
mongoose.connect('mongodb://localhost:27017/weatherdb');

/* Get api listening */
router.get('/', (req, res) => {
  res.send('api works');
});

// Get all weather data
router.get('/weather', (req, res) => {
  // Get weather data from the Database
  Weather.find({}, 'timestamp tempf -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    let series = weatherData.map( data => {
      return {
        'name': data.timestamp,
        'value': data.tempf
      };
    });

    let ngxData = {
      'name': 'TempF',
      'series': series
    }


    //console.log(typeof weatherData);
    //console.log(weatherData);

    res.json(ngxData);
  });
});

module.exports = router;
