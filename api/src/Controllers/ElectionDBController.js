const mongoose = require('mongoose');
const electionSchema = require('../schemas/Election');
const ballotSchema = require('../schemas/Ballot');
const { v4: uuidv4 } = require('uuid');
// const { app }= require('../app');
require('dotenv').config();

/**
 * Mongoose Schema
 * */
let Election;
let Ballot;

/**
 * Database Client Options and URI config
 */
let CLIENT_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Autoindex defined by schema great for development not production
    poolSize: 5, // Default size is 5, only 1 operation per socket at a time
    serverSelectionTimeoutMS: 5000, // Default is 30s
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    keepAlive: true,
    keepAliveInitialDelay: 300000, // TCP KeepAlive every 30s
    family: 4 // Use IPv4, skip trying IPv6
};

let {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOSTNAME,
    MONGO_PORT,
    ELECTION_DB
} = process.env;

const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${ELECTION_DB}?authSource=admin`

class ElectionDB {

    constructor() {
        this.electionData;
        this.ballotData;

        try {
            this.conn = mongoose.createConnection(URI, CLIENT_OPTIONS);
            this.conn.on('connected', () => {
                // Notify app
                console.log('Connected to Election DB');

            });
            this.conn.on('error', (error) => {
                console.log('Error', error);
            });
        } catch (error) {
            console.log('ERROR: ', error);
        }

        //Register schema to connection
        Election = this.conn.model('election', electionSchema, 'election');
        Ballot = this.conn.model('ballot', ballotSchema, 'candidates');
    }

    /**
     * Loads elections and the associated ballots
     */
    loadData() {
        this.getElection()
            .then(res => {
                this.electionData = res;
                return res;
                // TODO - REFACTOR in the case this is no election is found.
            })
            .then(election => {
                return this.getBallots(election.election_id)
            })
            .then(res => {
                this.ballotData = res;
                // console.log('Ballot: ', this.ballotData);
            });
    }

    /**
     * Retrieve elections that are available to vote in
     * TODO - refactor to allow for multiple elections in database
     */
    async getElection() {
        // TODO - Fix query to alllow for filter by date
        // const query = Election.find({ election_end_date: { $gte: '2020-01-01', $lte: '2020-12-31' } });
        // const query = Election.findOne({ election_end_date: { $gt: date } });
        // const query = Election.find({_id: '5ec43093b2b54522f14c1ba5'}); // Works
        const query = Election.findOne();
        const res = await query.exec();

        return res;
    }

    // /**
    //  * Retrieves ballots based on electionId
    //  * @param {*} electionId 
    //  * TODO - Refactor to allow for multiple elections and multiple wards
    //  */
    async getBallots(electionId) {
        // const query = Ballot.findOne();
        const query = Ballot.findOne({ election_id: electionId });
        const res = await query.exec();

        return res;
    }

    // Testing insertion
    async createElection() {
        let electionUUID = uuidv4()
        await Election.create({
            election_id: electionUUID,
            election_name: "Oakville Municipal Election 2020",
            election_start_date: "2020-01-01T00:00:00-05:00",
            election_end_date: "2020-12-31T24:00:00-05:00",
            advanced_polling: true,
            advanced_start_date: "2020-01-01T00:00:00-05:00",
            advanced_end_date: "2020-12-31T24:00:00-05:00",
        });
    }
}

module.exports = new ElectionDB();