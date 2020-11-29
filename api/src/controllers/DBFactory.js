const DBConnection = require('./DBConnection');
 
class DBFactory {
    create(database) {
        return new DBConnection(database);
    }
}

module.exports = new DBFactory();