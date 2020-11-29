// DB Connection Factory

const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseConnection {

    constructor(dbName, params) {
        this.database = dbName;
        this.conn = null;

        this.initDbConnect();

        const CLIENT_OPTIONS = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            autoIndex: false, // Autoindex defined by schema great for development not production
            poolSize: 10, // Default size is 5, only 1 operation per socket at a time
            serverSelectionTimeoutMS: 5000, // Default is 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            keepAlive: true,
            keepAliveInitialDelay: 300000, // TCP KeepAlive every 30s
            family: 4 // Use IPv4, skip trying IPv6
        };
    }

    initDbConnect() {
        const {
            MONGO_USERNAME,
            MONGO_PASSWORD,
            MONGO_HOSTNAME,
            MONGO_PORT,
        } = process.env;

        const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${this.database}?authSource=admin`

        if (!this.conn) {
            try {
                let conn = mongoose.connect(URI, this.CLIENT_OPTIONS)
                    .then(() => {
                        this.conn = conn;
                        console.log('Connected to DB')
                    });
            } catch (error) {
                console.log('Error: ', error)
            }


        }

    }
}

module.exports = DatabaseConnection;