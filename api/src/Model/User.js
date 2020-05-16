// module.exports = class User {
//     constructor(first, middle, last, email) {
//         this.first = first;
//         this.middle = middle;
//         this.last = last;
//         this.email = email;
//     }

//     toArray() {
//         return Object.toArray(this);
//     }

// }
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        index: true,
        unique: true,
    },
    fullName: {
        firstName: {
            type: String,
            // required: true,
        },
        middleName: {
            type: String,
            // required: false,
        },
        lastName: {
            type: String,
            // required: true,
        },
    },
    email: {
        type: String,
        // required: true,
    },
    voterId: {
        type: String
    }
})