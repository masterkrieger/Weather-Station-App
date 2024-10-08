/*
 * Author: Jeremy Barr
 * Date: 26-May-2017
 * Description: Mongoose Schema for the Weather API.
 *
*/

const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
  station_id: String,
  timestamp: Date,
  dewptf: String,
  dewptc: String,
  altitude_ft: String,
  altitude_m: String,
  humidity: String,
  pressure: String,
  tempc: String,
  tempf: String,
  time: String,
  battery: String,
  firmware_version: String

},{ collection: 'weatherdata' });

module.exports = mongoose.model('Weather', WeatherSchema);;
