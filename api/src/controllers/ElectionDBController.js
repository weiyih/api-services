const DBFactory = require("./DBFactory");
const electionSchema = require("../schemas/Election");
const ballotSchema = require("../schemas/Ballot");

require("dotenv").config();

class ElectionDB {
  static Election;
  static Ballot;

  constructor() {
    const {
      ELECTION_DB,
    } = process.env;

    try {
      this.conn = DBFactory.create(ELECTION_DB);

      // Register model schema to connection
      this.conn.on("connected", () => {
        this.Election = this.conn.model("election", electionSchema, "election");
        this.Ballot = this.conn.model("ballot", ballotSchema, "candidates");
      });

      this.conn.on("error", (error) => {
        console.log("Connection Error:", error);
      });
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }

  /**
   * Retrieve all valid elections
   */
  async getElection(req, res, next) {
    // Build query
    const query = this.Election.find().where("disabled").equals("1");
    // .where('election_end_date').gt()

    try {
      const data = await query.exec();
      return res.json(data);
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  }

  // /**
  //  * Retrieves ballots based on electionId
  //  * @param {*} electionId
  //  * TODO - Refactor to allow for multiple elections and multiple wards
  //  */
  // async getBallots(electionId) {
  async getBallots(req, res, next) {
    const query = this.Ballot.findOne({ election_id: electionId });

    try {
      const res = await query.exec();
      return res.json(data);
    } catch (error) {
      // TODO - handle error
      console.log(error);
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = new ElectionDB();
