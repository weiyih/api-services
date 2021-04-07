"use strict"; // No undeclared variable usage

const express = require("express");
const helmet = require("helmet"); // https://helmetjs.github.io
const bodyParser = require("body-parser"); // https://github.com/expressjs/body-parser body parsing middleware
const cookieParser = require("cookie-parser");
const cors = require("cors"); // https://github.com/expressjs/cors CORS middleware
const morgan = require("morgan"); // https://github.com/expressjs/morgan HTTP request logger middleware
const logger = require("morgan");
const ElectionDB = require("./controllers/ElectionDBController");
const UserDB = require("./controllers/UserDBController");
const VoterDB = require("./controllers/VoterDBController");
// const Transaction = require("./controllers/TransactionController");
const {authenticateJWT} = require("./controllers/AuthJWT")

require("dotenv").config();

/**
 * Express Settings
 */
const app = express();
app.use(cookieParser());
app.use(helmet()); // Helmet middleware to enforce HSTS
app.use(bodyParser.json()); //parse JSON bodies into JS objects
app.use(cors());
app.use(morgan("combined"));

/**
 * POST REQUEST
 * Response: Success or Failed
 */
app.post("/v1/signup", (req, res) => {
    const user = req.body;
    /*
    * TODO
    * Verify user credentials by matching VoterDB
    */
    UserDB.createUser(user, "voter-uuid-placeholder")
        .then((res) => {
            const response = {
                status: true,
                data: {
                    message: "signup successful",
                    user: res.user_id,
                },
            };
            res.send(response);
        })
        .catch((error) => {
            const response = {
                status: false,
                data: {
                    message: "signup unsuccessful",
                    error: error,
                },
            };
            res.send(response);
        });
});

// Login Controller
// JWT_EXPIRY_SECOND = 10 minutes
app.post("/v1/login", UserDB.login);


/**
 * GET REQUEST
 * Response: Election JSON object
 */
// app.get('/v1/election', authenticateJWT, (req, res) => {

// app.get("/v1/election/:id", ElectionDB.getElection);

app.get("/v1/election", ElectionDB.getAllElection);

app.get("/v1/candidates/:id", ElectionDB.getCandidates);

app.get('/v1/voters', VoterDB.getVoter);
// app.get('/v1/voters', VoterDB.getVoterStream);


/**
 * GET REQUEST
 * Response: Ballot JSON object
 */
// app.get('/v1/ballot', authenticateJWT, (req, res) => {

app.get("/v1/ballot/:id", (req, authenticateJWT, res) => {
    // const data = ElectionDB.ballotData;
    const election = req.body
    const data = ElectionDB.getBallots(electionId)
    res.json(data);
});

/**
 * POST REQUEST
 * Submit ballot
 */
// app.post("/v1/submit", 
//   authenticateJWT,
//   checkVoteStatus,
//   validateBallot,
//   submitTransaction
// );


app.post("/v1/submit", function (req, res) {
    try {
        const ballot = req.body;

        //Validate ballot before validating user
        const validated = validateBallot(ballot);
        // Vote not validated
        if (!validated) {
            const response = {
                status: false,
                data: {
                    error: "error",
                    message: "unable to submit vote",
                },
            };
            res.send(response);
        } else {
            //req.verified is set from authenticateJWT
            const userId = req.verified.user_id;
            let user;
            let voter;
            let voterId;

            // Load User and Voter profiles
            UserDB.loadUser(userId)
                .then((userResult) => {
                    user = userResult;
                    voterId = user.voter_id;
                    return VoterDB.loadVoter(voterId);
                })
                .then((voterResult) => {
                    voter = voterResult;
                    const voteStatus = voter.vote_status;

                    // TODO: DISABLE CURRENTLY TO ALLOW TRANSACTIOn
                    // if (voteStatus == 'Yes') {
                    //   throw new Error('user has voted');
                    // }

                    // TODO - Pending Vote Status
                    // } else if (voteStatus === 'Pending') {
                    //   throw new Error("vote pending");
                    // }
                    return Transaction.submitTransaction(ballot);
                })
                .then((submitResult) => {
                    // TODO - Email receipt
                    if (submitResult == true) {
                        VoterDB.updateUserVoteStatus(voterId, "Yes");
                        const response = {
                            status: true,
                            data: {
                                message: "submitted",
                            },
                        };
                        res.send(response);
                        // } else {
                        //   VoterDB.updateUserVoteStatus(voterId, "No");
                    }
                })
                // TODO - Fix catch error centralize
                .catch((error) => {
                    // throw new Error(error);
                    const response = {
                        status: true,
                        data: {
                            error: "error",
                            message: error.message,
                        },
                    };
                    res.send(response);
                });
        }
    } catch (error) {
        console.log("error", error);
    }
});

// // Missing routes are forbidden
// app.use((req, res, next) => {
//   res.status(403).end()
//   next();
// });

// TODO - Refactor to a seperate file
// Check if ballot has incorrect data
function validateBallot(ballot) {
    // Invalid election id
    if (ballot.election_id !== ElectionDB.electionData.election_id) {
        return false;
    }

    // TODO - Ward/District Verification

    // Timestamp and election dates
    const currentTime = Date.now();
    const ballotTime = Number(ballot.timestamp);
    // TODO - REDUCE TIME
    const SUBMISSION_LIMIT = 6000000; // 10 minutes

    // Prevent ballot from being submitted if submission timestamp is >= SUBMISSION_LIMIT
    if (currentTime - ballotTime >= SUBMISSION_LIMIT) {
        return false;
    }

    // Ensure Election allows for electronic voting
    // Somewhat redundant but may be required in the future?
    if (ElectionDB.electionData.advanced_polling) {
        // Ensure voting period is within the advanced poll and election dates
        const advStartDate = Date.parse(
            ElectionDB.electionData.advanced_start_date
        );
        const advEndDate = Date.parse(ElectionDB.electionData.advanced_end_date);

        const electionStartDate = Date.parse(
            ElectionDB.electionData.election_start_date
        );
        const electionEndDate = Date.parse(
            ElectionDB.electionData.election_end_date
        );

        if (currentTime < advStartDate || currentTime >= advEndDate) {
            return false;
        }
        if (currentTime < electionStartDate || currentTime > electionEndDate) {
            return false;
        }

        // Ensure candidate selected is part of the list of eligible candidates
        const candidates = ElectionDB.ballotData.candidate;

        let candidateList = [];
        for (const [key, candidate] of Object.entries(candidates)) {
            candidateList.push(candidate.candidate_id);
        }
        if (!candidateList.includes(ballot.selected_candidate)) {
            return false;
        }
        return true;
    }
}

module.exports = app;
