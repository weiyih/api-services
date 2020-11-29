// DB Connection Factory

const mongoose = require("mongoose");
require("dotenv").config();

class DBConnection {
  static CLIENT_OPTIONS = {
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
    family: 4, // Use IPv4, skip trying IPv6
  };

  constructor(database) {
    this.conn = null;

    this.initDbConnect(database);
  }

  initDbConnect(database) {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOSTNAME,
      MONGO_PORT,
    } = process.env;

    const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${database}?authSource=admin`;

    try {
      this.conn = mongoose.createConnection(URI, CLIENT_OPTIONS);
      this.conn.on("connected", () => {
        console.log(`Connected to ${database} DB`);
      });
      // Register listener for
      this.conn.on("error", (error) => {
        console.log("Connection Error:", error);
      });
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }
}

module.exports = DBConnection;
