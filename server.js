/*
 * Author: Jeremy Barr
 * Date Created: 09-Aug-2024
 * Description: MEAN Stack Server  to route to '/api' and '*' to all other routes (Anguar routes).
 * Version: 2.0
 * TODO: 
 *   - Add .env file for environment variables (https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
*/

// Get dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// Get API routes
const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist/weather-station-app/browser/')));

// Set our api routes
app.use('/api', api);

// Catch all other routes and return the index files
app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, 'dist/weather-station-app/browser/index.html'));
});

/**
 * Get port from exnvirnment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});