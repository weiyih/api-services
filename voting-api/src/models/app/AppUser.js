class AppUser {
    constructor(email, token, verified) {
        this.email = email;
        this.token = token;
        this.verified = verified;
    }
}

module.exports = AppUser;