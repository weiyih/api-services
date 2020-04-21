// Documentation
// https://github.com/mysqljs/mysql2


const User = require('../Model/User.js');
const mysql = require('mysql2');

const userDB = mysql.createPool({
    connectionLimit : 20,
    host            : 'localhost',
    user            : 'admin',
    password        : 'blockchain'
})

function connectDatabase() {
    userDB.connect( (err) => {
        if (err) {
            console.error('Error: Connecting to MySQL : ' + err.stack);
            return;
        }
        console.log('Connect to MySQL as  id : ' + userDB.threadId);
    });
}

function closeDatabase() {
    userDB.end( (err) => {
        if (err) {
            console.error('Error: Closing MySQL : ' + err.stack);
            return;
        }
        console.log('Successfuly closed connection to MySQL');
    });
}

// Insert
function createUser(user){
    if (user instanceof User) {
        userValues = user.toArray();

        userDB.query({
            sql: 'INSERT INTO users',
            timeout: 30000,
            values: userValues
        }, (error, results, fields) => {
    
        });
    }
  
}

