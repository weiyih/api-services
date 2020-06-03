'use strict'; // No undeclared variable usage

const express = require('express');
const helmet = require('helmet'); // https://helmetjs.github.io
const bodyParser = require('body-parser'); // https://github.com/expressjs/body-parser body parsing middleware
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const cors = require('cors'); // https://github.com/expressjs/cors CORS middleware
const morgan = require('morgan'); // https://github.com/expressjs/morgan HTTP request logger middleware
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
// const logger = require('morgan');
const ElectionDB = require('./controllers/ElectionDBController');
const UserDB = require('./controllers/UserDBController');
require('dotenv').config();

const {
  JWT_EXPIRY_SECOND,
  JWT_PRIVATE_KEYFILE,
} = process.env;

const JWT_PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, "./config/ec_private.pem")
);
// const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;


/**
 * Express Settings
 */
const app = express();
// app.use(cookieSession({
//   name: 'session',
//   keys: ['token'],
//   maxAge: JWT_EXPIRY_SECOND,
// }))
app.use(cookieParser());
app.use(helmet()); // Helmet middleware to enforce HSTS
app.use(bodyParser.json()); //parse JSON bodies into JS objects
app.use(cors());
app.use(morgan('combined'));
// app.use(bodyParser.urlencoded({}))


/**
 * POST REQUEST
 * Response: Success or Failed
 */
app.post('/v1/signup', (req, res) => {
  const user = req.body

  // TODO - Verify user credentials and match to voter DB
  UserDB.createUser(user, 'voter-uuid-placeholder')
    .then((res) => {
      const response = {
        'status': true,
        'data': {
          'message': 'signup successful',
          'user': res.user_id
        }
      }
      res.send(response);
    }).catch(error => {
      const response = {
        'status': true,
        'data': {
          'message': 'signup unsuccessful',
          'error': error
        }
      }
      res.send(response);
    });
})


// Login Controller
// JWT_EXPIRY_SECOND = 10 minutes
app.post('/v1/login', (req, res) => {

  // TODO Login with user credentials
  const user = req.body;
  console.log(user);

  let response = {
    status: "success",
    message: "logged in",
  };
  // Generate JWT based on user_id
  jwt.sign({ 'user_id': '222078a2-054e-4cc0-b8ae-c0693eadbafb' },
    JWT_PRIVATE_KEY,
    { expiresIn: JWT_EXPIRY_SECOND, algorithm: 'ES256' },
    function (err, token) {
      if (err) { console.log(err) }
      // Set cookie as token string and send
      console.log(token);
      res.cookie('token', token, { maxAge: JWT_EXPIRY_SECOND });
      res.send(response);
    });
});


/**
 * GET REQUEST
 * Response: Election JSON object
 */
app.get('/v1/election', (req, res) => {
  const data = ElectionDB.electionData;
  // console.log(data);
  // TODO - PKI encrypt data
  res.json(data)
});


/**
 * GET REQUEST
 * Response: Ballot JSON object
 */
app.get('/v1/ballot', (req, res) => {
  const data = ElectionDB.ballotData;
  res.json(data);
});

/**
 * POST REQUEST
 * Submit ballot
 */
app.post('/v1/submit', (req, res) => {

  // Validate JWT
  // Get user_id
  const user_id = '222078a2-054e-4cc0-b8ae-c0693eadbafb';

  // const ballot = req.body;
  // Validate ballot JWT from user
  // const userPublicKey = UserDB.getPublicKey(user.user_id);
  const ballot = {
    'election_id': '9cd5f582-75e5-4bee-b451-e5417c18e761',
    'ward': "1",
    'selected_candidate': '2d8248ab-a831-4b5c-a3b2-6c5ef317731a',
    'timestamp': Date().now(),
  }

  let response = {
    "success": true,
    "data": {
      "message": ''
    }
  }
  let suceess;
  let message;

  //Validate ballot before validating user 1
  if (validateBallot(ballot)) {
    // Load User
    UserDB.loadUser(user_id)
      // Load voter information and check voter status
      .then(function (user) {
        const voterId = user.voter_id;
        // return VoterDB.getVoterStatus(voter_id);
        // Temporary dummy data
        return {
          voter_id: '3b241101-e2bb-4255-8caf-4136c566a962',
          ward: 1,
          vote_status: 'No',
        }
      })
      // Check voter vote status
      // Yes - Notify user
      // Pending - Notify user
      // No - process vote
      .then(function (voter) {
        const voteStatus = voter.vote_status;
        // TODO Create custom Error
        if (voteStatus === 'Yes') {
          throw new Error('user has voted');
        }
        if (voteStatus === 'Pending') {
          throw new Error("vote pending");
        }
        return //Submit Vote
      }
        .catch(error => {
          suceess = false;
          if (error.message == 'user has voted') {
            message = 'user voted';
          } else if (error.message == 'vote pending')
            message = 'vote pending';
        }));
  }

  const vote = {
    user_timestamp: ballot.timestamp,
  }

});

// Default route - 403
app.use((req, res) => {
  res.status(403).end()
});

// Check if ballot has incorrect data
const validateBallot = (ballot) => {
  // Invalid election id
  if (ballot.election_id !== ElectionDB.electionData.election_id) {
    return false;
  }

  // Timestamp and election dates
  const currentTime = Date().now()
  if (currentTime - ballot.timestamp >= 30000) { return false; }

  // Advanced polling enabled
  if (ElectionDB.electionData.advanced_polling) {
    if (
      (currentTime < ElectionDB.electionData.advanced_start_date) ||
      (currentTime > ElectionDB.electionData.advanced_end_date)
    ) { return false; }
  } else {
    if (
      (currentTime < ElectionDB.electionData.election_start_date) ||
      (currentTime > ElectionDB.electionData.election_end_date)
    ) { return false; }
  }

  // Check selected candidate is within ward
  if (!ElectionDB.ballotData.candidate.include(ballot.selected_candidate)) {
    return false;
  }
  return true;
}

module.exports = app;