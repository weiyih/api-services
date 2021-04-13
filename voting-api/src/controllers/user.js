const UserDB = require("./UserDBController");
const VoterDB = require("./VoterDBController");

async function loadData(req, res, next) {
    const verified = req.verified
    try {
        const user = await UserDB.getUserId(verified.username)
        const voter = await VoterDB.getVoter(user.voter_id)
        req.user = user
        req.voter = voter
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message });
    }
}

async function login(req, res) {
    try {
        const login = req.body;
        if (!login) {
            throw Error("Error - missing username/password");
        }
        const user = UserDB.getUserEmail(login.username)

        // TODO - Password hash comparison
        // TODO - Compare deviceIdHash
        // TODO - Conditions array ("array.includes(false)")
        if (user.email == login.username && user.password == login.password) {
            // Generate JWT based on email
            const authToken = await authJWT.generateJWT(user)

            const appUser = new AppUser(
                user.email,
                authToken,
                user.verified_status
            )

            if (authToken) {
                res.cookie("token", authToken, { maxAge: parseInt(JWT_EXPIRY_SECOND) });
                res.json(appUser);
            }
        } else {
            throw Error("Error - Invalid username/password");
        }

    } catch (error) {
        console.log(error.message);
        let response = {
            status: "error",
            message: error.message,
        };
        return res.send(response);
    }
}

module.exports = { loadData, login }