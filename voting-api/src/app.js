"use strict"; // No undeclared variable usage

const express = require("express");
const helmet = require("helmet"); // https://helmetjs.github.io
const cookieParser = require("cookie-parser");
const cors = require("cors"); // https://github.com/expressjs/cors CORS middleware
const morgan = require("morgan"); // https://github.com/expressjs/morgan HTTP request logger middleware
const logger = require("morgan");
const { authenticate } = require("./services/auth")
const { loadUser, login, registerBiometric } = require("./api/user")
const { getBallot, validateBallot, submitBallot, checkVoteStatus } = require("./api/ballot");
const { loadElection, getElections } = require("./api/election");
const { queryElectionVotes, queryElection, queryUsers, queryVoters, queryCandidates } = require("./api/admin");
require("dotenv").config();

/**
 * Express Settings
 */
const app = express();
app.use(cookieParser());
app.use(helmet()); // Helmet middleware to enforce HSTS
app.use(express.json()); //parse JSON bodies into JS objects
app.use(cors());
app.use(morgan("combined"));

app.post("/v1/login",
    login
);

app.post("/v1/register",
    authenticate,
    registerBiometric
);

/**
 * Returns all election objects
 * Response: Election JSON object
 */
app.post("/v1/election",
    authenticate,
    loadUser,
    getElections
);

/**
 * POST REQUEST
 * Response: Ballot JSON object
 */
app.post("/v1/ballot/:id",
    authenticate,
    loadUser,
    getBallot
)

/**
 * POST REQUEST - Ballot submission
 * :id - electionId
 * Response: Success/Failed response
 */
app.post("/v1/submit/:id",
    authenticate,
    loadUser,
    loadElection,
    checkVoteStatus,
    validateBallot,
    submitBallot
);


/* Temporary Admin Routes */

app.post("/v1/admin/election",
    queryElection
)

app.post("/v1/admin/query/:id",
    queryElectionVotes
)

app.post("/v1/admin/users",
    queryUsers
)

app.post("/v1/admin/voters",
    queryVoters
)

app.post("/v1/admin/election/:id", 
    queryCandidates
)

module.exports = app;
