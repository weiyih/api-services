// DB Connection Factory

const mongoose = require("mongoose");
require("dotenv").config();

let CLIENT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Autoindex defined by schema great for development not production
  poolSize: 100, // Default size is 5, only 1 operation per socket at a time
  serverSelectionTimeoutMS: 5000, // Default is 30s
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  keepAlive: true,
  keepAliveInitialDelay: 300000, // TCP KeepAlive every 30s
  family: 4, // Use IPv4, skip trying IPv6
};


class DBConnection {

  constructor(database) {
    this.conn = this.init(database);
  }

  init(database) {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOSTNAME,
      MONGO_PORT,
    } = process.env;

    const URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${database}?authSource=admin`;

    try {
      const conn = mongoose.createConnection(URI, CLIENT_OPTIONS);

      conn.on("connected", () => {
        console.log(`Connected to ${database} DB`);
      });
      // Register listener for
      conn.on("error", (error) => {
        console.log("Connection Error:", error);
      });

      return conn;
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }
}

module.exports = DBConnection;
