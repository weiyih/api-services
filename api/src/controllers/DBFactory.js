const DBConnection = require('./DBConnection');
 
class DBFactory {
    create(database) {
        let conn = new DBConnection(database);
        return conn;
    }
}

module.exports = new DBFactory();