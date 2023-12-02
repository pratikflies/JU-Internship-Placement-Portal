const knex = require("./db");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
// const { sendEmail } = require("../nodemailer/nodemailer");
require("dotenv").config();

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await knex("user").where("email", email).first();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [newUserId] = await knex("user")
      .insert({
        email,
        password: hashedPassword,
        admin: false,
        emailVerified: false,
        status: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning("id");

    const token = crypto.randomBytes(20).toString("hex");
    const activationUrl = `${process.env.LOCAL_URL}/activate-account/${token}`;

    await knex("token_log").insert({
      id: newUserId.id,
      token: token,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "one_time_activation",
      status: "Active",
    });

    await sendEmail({
      to: email,
      subject: "JU Placement and Internship Portal account activation",
      text: `Hey ${email},
      Before we get started, we just need to confirm that this is you.
      Click below to activate your account: ${activationUrl}`,
    });

    return res
      .status(201)
      .json({
        message:
          "Verification email sent. Please check your email.",
      });
  } catch (error) {
    console.log("Sign Up Error:", error);
    return res
      .status(500)
      .json({ message: "Registration Failed.", error: error.message });
  }
};

const me = async (req, res) => {
  const userId = req.userId;

  try {
    const existingUser = await knex("user").where("id", userId).first();

    if (!existingUser) {
      return res.status(400).json({
        message: "Unauthorized access (severity high), how're you even here?",
      });
    }

    return res.status(200).send({
      user: existingUser,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unauthorized access detected while searching for user",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  me,
};
