const mongoose = require('mongoose');
const voterSchema = require('../schemas/Voter');
require('dotenv').config();

/**
 * Mongoose Schema
 * */
let Voter;

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
    VOTER_DB
} = process.env;

// const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/${USER_DB}?authSource=admin`
const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${VOTER_DB}?authSource=admin`

class VoterDB {
    constructor() {
        this.conn = mongoose.createConnection(URI, CLIENT_OPTIONS);
        this.conn.on('connected', () => {
            // TODO - Notify app
            console.log('Connected to Voter DB');
        });
        this.conn.on('error', (error) => {
            console.log('Error', error);
        });

        //Register schema to connection
        Voter = this.conn.model('voter', voterSchema, 'voter');
    }

    // Retrieves the voter based on the voter uuid
    async loadVoter(voterId) {
        const query = Voter.findOne({ voter_id: voterId });
        const res = await query.exec();

        if (!res) {
            return null;
        }
        return res;
    }

    // Updates Voter document of the voting status
    async updateUserVoteStatus(voterId, status) {
        const query = Voter.findOneAndUpdate({ voter_id: voterId }, { vote_status: status }, { new: true });
        const res = await query.exec();

        if (!res) {
            return null;
        }
        return res;
    }

    // Updates Voter document to reflect the User intention to vote online when registering 
    async updateUserOnlineVote(voterId) {
        const query = Voter.findOneAndUpdate({ voter_id: voterId }, { vote_online: 'Yes' }, { new: true });
        const res = await query.exec();

        if (!res) {
            return null;
        }
        return res;
    }


}

module.exports = new VoterDB();
