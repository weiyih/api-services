'use strict'; // No undeclared variable usage
// import express from 'express';
const DatabaseController = require('./Controllers/DatabaseController');


const express = require('express');
const helmet = require('helmet'); // https://helmetjs.github.io
const bodyParser = require('body-parser'); // https://github.com/expressjs/body-parser body parsing middleware
const uuidv4 = require('uuid');
const cors = require('cors'); // https://github.com/expressjs/cors CORS middleware
const morgan = require('morgan'); // https://github.com/expressjs/morgan HTTP request logger middleware
// const path = require('path');
const fs = require('fs');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
const https = require('https');
const http = require('http');


// const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
const app = express();
const PORT = 8080;
const SERVER_TIME = new Date()

app.use(helmet()); // Helmet middleware to enforce HSTS
app.use(bodyParser.json()); //parse JSON bodies into JS objects
app.use(cors());
app.use(morgan('combined'));
// app.use(bodyParser.urlencoded({}))
// app.use(express.urlencoded())

app.get('/', (req, res) => {
  res.send('GET request to server');
})

// App loads upcoming election details
app.get('/v1/election', (req, res) => {
  /* TODO
  1. Load details from Election DB formated to JSON object
  2. Details loaded based on:
  - Voter List DB - District/Ward
  - User DB -> 
  */
  res.json(
    { electionId: 100, name: 'Oakville Municipal Election 2020', startDate: Date.UTC(2020, 1, 1), endDate: Date.UTC(2020, 12, 31, 23, 59, 59), advStartDate: Date.UTC(2020, 1, 1), advEndDate: Date.UTC(2020, 12, 31, 23, 59, 59) });
});

// Returns ballot candidates based on id
app.get('/v1/ballot', (req, res, next) => {
  /*
  TODO
  1. Load candidates from Election DB - Candidates based on ward id
  */
  res.json([
    { candidateId: 10001, candidateName: 'Oscar Grouch' },
    { candidateId: 10002, candidateName: 'Count von Count' },
    { candidateId: 10003, candidateName: 'Cookie Monster' },
    { candidateId: 10004, candidateName: 'Big Bird' },
    { candidateId: 10005, candidateName: 'Kermit Frog' }
  ])
});

// Login Controller
// TODO - OAuth or Auth0 with JWT tokens
// TODO - Brute force attack logins
app.post('/v1/login', (req, res) => {
  // loginHandler
  res.send('Login');
});

// Requires token
app.post('/v1/submit', (req, res) => {


  /* TODO 
    1. JWT Web Token Validation
    2. Extract data object from req
    3. Decrypt data object
    4. Extract vote object
    5. Validate vote params
    6. Submit vote
  */

  // TODO - Verify user
  const submit_id = uuid
  let message = ""
  let status = "sucess"

  // const data = req.body;
  // TODO - Decrypt data object
  // const vote = data.json();
  // console.log(vote);
  const vote = {
    timestamp: SERVER_TIME.now(),
    electionId: 100,
    candidateId: 10001,
  }
  const ADVANCED_POLL_START_TIME = 1577836800; // 1/1/2020 @ 12:00am
  const ADVANCED_POLL_END_TIME = 1609372800; // 12/31/2020 @ 12:00am

  // PROCESS VOTE
  do {
    let serverTimestamp = SERVER_TIME.now();
    // Valid Voting Time

    if ((serverTimestamp < ADVANCED_POLL_START_TIME || serverTimestamp > ADVANCED_POLL_END_TIME)) {
      status = "error";
      message = "invalid voting period"
      break;
    }

    // Time Check
    if ((serverTimestamp - vote.timestamp) <= MAX_TIMESTAMP_DIFF) {

    }
  }
  while (false)

  // Check candidates with districts

  // Response Message
  const res_message = {
    status: status,
    message: message,
  };
  return res.send(res_message);
});

app.use((req, res, next) => {
  res.status(404).send({
    error: "Not found"
  })
})


// Using self-signed cert for SSL due to lack of domain name
// Migrate to certbot for CA generation with domain name
// const serverOptions = {
//   key: fs.readFileSync('./config/server-key.pem'),
//   cert: fs.readFileSync('./config/server-cert.pem'),
// }

// https.createServer({
//   key: fs.readFileSync(),
//   cert: fs.readFileSync()
// }, app);


// TODO - Initialize DB connection and BN network connection before starting server
// VerificationController - Voter List DB
// AuthenticationController - User DB
// ElectionController - Election DB
// const transactionController = TransactionController()

const database = new DatabaseController()
const electionData = database.getElections()

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log('Listening on HTTP port ' + PORT);
});


