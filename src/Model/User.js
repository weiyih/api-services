module.exports = class User {
    constructor(first, middle, last, email) {
        this.first = first;
        this.middle = middle;
        this.last = last;
        this.email = email;
    }

    toArray() {
        return Object.toArray(this);
    }

}