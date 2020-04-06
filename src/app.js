'use strict'; // No undeclared variable usage
// import express from 'express';
// import LoginController from './Controllers/LoginController';
const express = require('express');
const path = require('path');
// const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const logger = require('morgan');
const https = require('https');
const http = require('http');
const fs = require('fs');



// VerificationController - Voter List DB
// AuthenticationController - User DB
// ElectionController - Election DB
// const transactionController = TransactionController()

// SERVER CONFIG
const HOST = '127.0.0.1';
const PORT = 8080;

// const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;
const app = express();
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
    { candidateId: 10001, candidateName: 'Oscar Grouch'},
    { candidateId: 10002, candidateName: 'Count von Count'},
    { candidateId: 10003, candidateName: 'Cookie Monster'},
    { candidateId: 10004, candidateName: 'Big Bird'},
    { candidateId: 10005, candidateName: 'Kermit Frog'}
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
  // TODO - CHECK TOKEN
  // Decode request and vote


  // Extract vote object
  // Create Transaction Object
  // Submit Vote
  // Register event listener

});

// const serverOptions = {
//   key: fs.readFileSync('./config/server-key.pem'),
//   cert: fs.readFileSync('./config/server-cert.pem'),
// }

// https.createServer({
//   key: fs.readFileSync(),
//   cert: fs.readFileSync()
// }, app);

const server = http.createServer(app);
server.listen(PORT);

