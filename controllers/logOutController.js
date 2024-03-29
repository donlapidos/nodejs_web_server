const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }

}

const fsPromises = require("fs").promises;
const path = require("path");


const handleLogOut = async (req, res) => {
    //On client also delete the accessToken

    const cookies = res.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //no content 
    const refreshToken = cookies.jwt;

    //Is refreshToken in db?
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }
    // Delete the refreshToken in db
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: " " };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, "..", "model", "users.json"),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }) //secure: true - only serves on https
    res.sendStatus(204)
}

module.exports = { handleLogOut };