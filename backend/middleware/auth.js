const jwt = require("jsonwebtoken");
const knex = require("../library/db");
require("dotenv").config();

const authMiddleware = async (req, res, next) => {
  let authToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    authToken = req.headers.authorization.split(" ")[1];
  }
  if (!authToken) {
    console.log("Redirecting to Login. Authorization Failed");
    return res
      .status(401)
      .send({ message: "Unauthorized access. Please Login To continue." });
  } else {
    try {
      const existingAuth = await knex("token_log")
        .select()
        .where("token", authToken)
        .first();
      if (existingAuth.status === "Active") {
        const credentials = jwt.verify(authToken, process.env.ACCESS_SECRET);
        req.userId = credentials.id;
        return next();
      } else {
        console.log("Redirecting to Login. Authorization Failed");
        return res
          .status(401)
          .send({ message: "Unauthorized access. Please Login To continue." });
      }
    } catch (error) {
      console.log('Middleware Error: ', error);
    }
  }
};

module.exports = {
  authMiddleware,
};
