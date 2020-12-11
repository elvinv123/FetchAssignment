const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser'); // Used to parse data from requests
const app = express(); // Creates app object that can be configured with routes to listen for incoming requests

app.use(morgan('tiny')) // HTTP request logger middleware

// Tells our app to respond to JSON requests, and also respond to requests from other software like Postman  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('./routes/index.routes'))

const port = 5000;

app.listen(5000, () => console.log(`Server is running on port ${port}`))