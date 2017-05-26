var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WeatherSchema = new Schema({
  station_id: String,
  timestamp: String,
  altitude_ft: String,
  altitude_m: String,
  humidity: String,
  pressure: String,
  tempc: String,
  tempf: String,
  time: String
},{ collection: 'weatherdata' });

var Weather = mongoose.model('Weather',WeatherSchema);

module.exports = Weather;
