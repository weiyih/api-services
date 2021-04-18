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
const { authenticate } = require("./services/auth")
const { loadData, login } = require("./api/user")
const { getBallot } = require("./api/ballot")

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

app.post("/v1/login", login);

/**
 * Returns all election objects
 * Response: Election JSON object
 */
app.post("/v1/election",
    authenticate,
    ElectionDB.getAllElection
);

/**
 * POST REQUEST
 * Response: Ballot JSON object
 */
app.post("/v1/ballot/:id",
    authenticate,
    loadData,
    getBallot
)

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

module.exports = app;
