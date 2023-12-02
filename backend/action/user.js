const userDBLayer = require("../dbLayer/user");

async function updateUser (userId, user) {
    await userDBLayer.updateUser(userId, user);
}

async function getUserById (userId) {
    return userDBLayer.getUserById(userId);
}

module.exports = {
    updateUser,
    getUserById,
}