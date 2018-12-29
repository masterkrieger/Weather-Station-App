/*
 * Author: Jeremy Barr
 * Date: 26-May-2017
 * Description: Mongoose Schema for the Weather API.
 *
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WeatherSchema = new Schema({
  station_id: String,
  timestamp: Date,
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

var Weather = mongoose.model('Weather',WeatherSchema);

module.exports = Weather;
