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
router.post('/input', (req, res) => {

  // add the current timesstamp with the javascript Date() function
  req.body.timestamp = new Date();

  console.log(req.body);

  Weather.create(req.body, (err, post) => {
    
    if (err) return handleError(err)
    
    res.json(req.body);
  })

  //res.send(req.body);
});

/******************************
 Router Params
******************************/

router.param('dataset', function (req, res, next, dataset) {
  // Fetch the dataset from a database
  req.dataset = dataset;

  console.log('dataset = ', req.dataset);
  next();
});

router.param('limit', function (req, res, next, limit) {
  // Fetch the limited number of data entries (limit) from a database
  req.limit = limit;
  console.log('limit = ', req.limit);
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
  });
});

// Get the specified weather dataset and last number of entries.
router.get('/weather/:dataset/:limit', (req, res) => {

  // Get weather data from the Database
  Weather.find({}, 'timestamp ' + req.dataset +' -_id', (err, weatherData) => {
    if (err)
      res.send(err);

    // sorts on most recent entries
    let ngxData = weatherData.sort().map( data => {
      return {
        'name': data.timestamp,
        'value': data[req.dataset]
      };
    });

    // send response in json format.
    res.json( [{ 'name': req.dataset, 'series': ngxData }] );

    // Limit to number of results and '+' converts string to number.
    // Sorts the results by the 'timestamp' key in decending order
  }).limit(+req.limit).sort('-timestamp');
});

module.exports = router;
