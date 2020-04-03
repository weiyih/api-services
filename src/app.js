'use strict'; // No undeclared variable usage
// import express from 'express';
// import LoginController from './Controllers/LoginController';
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const https = require('http');


// VerificationController - Voter List DB
// AuthenticationController - User DB
// ElectionController - Election DB
const transactionController = TransactionController()


// SERVER CONFIG
const HOST = '127.0.0.1';
const PORT = 8080;
const app = express();
app.use(bodyParser.json());
app.use(express.json());
// app.use(express.static(path.))

app.use(express.urlencoded())

// App loads upcoming election details
app.get('/election', (req, res) => {
  /* TODO
  1. Load details from Election DB formated to JSON object
  2. Details loaded based on:
  - Voter List DB - District/Ward
  - User DB -> 
  */
  res.json([
    { electionId: 100, name: 'Oakville Municipal Election 2020', startDate: Date.UTC(2020, 01, 01), endDate: Date.UTC(2020, 12, 31, 23, 59, 59), advStartDate: Date.UTC(2020, 01, 01), advEndDate: Date.UTC(2020, 12, 31, 23, 59, 59) }]);
});

// Returns ballot candidates based on id
app.get('/ballots/:id', (req, res, next) => {
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
app.post('/api/login', (req, res) => {
  // loginHandler
  res.send('Login');
});

// Requires token
app.post('/api/submit', (req, res) => {
  // TODO - CHECK TOKEN
  // Decode request and vote


  // Extract vote object
  // Create Transaction Object
  // Submit Vote
  // Register event listener

});

const httpsServer = https.createServer({
  key: fs.readFileSync(),
  cert: fs.readFileSync()
}, app);


// const args = process.argv.slice(2)
// console.log(args)
// console.log(args['name'])
// // process.argv.forEach((val, index) => {
// //     console.log(`${index}: ${val}`)
// //   })

// const server = http.createServer((req,res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
//     process.exitCode = 0
// })    

// const userInput = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })

// SIGTERM -> Gracefully terminate2
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})

