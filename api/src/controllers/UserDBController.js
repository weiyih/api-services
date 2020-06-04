const mongoose = require('mongoose');
const userSchema = require('../schemas/User');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

/**
 * Mongoose Schema
 * */
let User;

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
    USER_DB
} = process.env;

// const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:${MONGO_PORT}/${USER_DB}?authSource=admin`
const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${USER_DB}?authSource=admin`

class UserDB {
    constructor() {
        this.conn = mongoose.createConnection(URI, CLIENT_OPTIONS);
        this.conn.on('connected', () => {
            // TODO - Notify app
            console.log('Connected to User DB');
        });
        this.conn.on('error', (error) => {
            console.log('Error', error);
        });

        //Register schema to connection
        User = this.conn.model('user', userSchema, 'user');
    }

    async loadUser(userId) {
        const query = User.findOne({ user_id: userId });
        const res = await query.exec();

        if (!res) {
            return null;
        }
        return res;
    }

    async createUser(userData, voterId) {
        const tempUserId = uuidv4();
        const tempVoterId = uuidv4();
        const currentDate = new Date().toISOString();

        const user = new User({
            user_id: tempUserId,
            full_name: {
                first_name: userData.first_name,
                middle_name: userData.middle_name,
                last_name: userData.last_name,
            },
            email: userData.email,
            email_status: 'Unverified',
            date_of_birth: userData.date_of_birth,
            // voter_id: voterId,
            voter_id: tempVoterId,
            date_create: currentDate,
            driver_license: userData.driver_license,
            // device_id: userData.device_id
            device_id: ''
        });

        // TODO check for UUID collision
        // TODO -Validate schema before save

        //save to database
        try{
            const result = await user.save();
            console.log('Result');
            console.log(result);
            
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }

    }

    
}

module.exports = new UserDB ();
