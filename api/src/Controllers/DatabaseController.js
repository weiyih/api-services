const mongoose = require('mongoose');

class DatabaseController {    

    static OPTIONS = {
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

    static instance = null;

    constructor() {
        const {
            MONGO_USERNAME,
            MONGO_PASSWORD,
            MONGO_HOSTNAME,
            MONGO_PORT,
            MONGO_DB
          } = process.env;

        const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
        const TEST_URI = 'mongodb://localhost/test'

        if (!DatabaseController.instance) {
            DatabaseController.instance = this 
        }

        mongoose.connect(URI, DatabaseController.OPTIONS);
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', () => {
            console.log.bind(console, 'connected:');
        });

        this.db = mongoose.connect(URI)
 

        return DatabaseController.instance;
    }
}

module.exports = DatabaseController;
