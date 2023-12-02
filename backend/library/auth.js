const jwt = require('jsonwebtoken');
const knex = require('./db');
const bcrypt = require('bcrypt');
// const { sendEmail } = require("../nodemailer/nodemailer");
require("dotenv").config();

// Generating token using jwt
const createAuthToken = function (user) {
  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "70d",
    },
  );
  return token;
};

const activateAccount = async (req, res) => {
  const { token } = req.params;

  try {
    // make sure the signup token hasn't expired 
    const user = await knex('token_log')
      .where('token', token)
      .andWhere('status', 'Active')
      .andWhereRaw('createdAt + interval \'1 hour\' > ?', [new Date()])
      .first();

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    // we get an email object 
    const email = await knex('user').where('id', user.id).update({
      emailVerified: true,
      updatedAt: new Date(),
    }).returning(['email'])
      .then(rows => rows[0]);

    await knex('token_log').where('token', user.token).update({
      status: 'Expired',
    });

    await sendEmail({
      to: email.email,
      subject: 'Welcome to JU Placement and Internship Portal!',
      text: `Hey ${email.email},
      Welcome aboard! Your journey towards a successful professional career starts here. 
      Your career opportunities await, and we're here to help you succeed. 🎊
      Feel free to reach out to officer.placement@jadavpuruniversity.in if you have any questions or need assistance, we’re here for you.
      Best Wishes,
      Office of the Placement and Training`,
    });

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.log('Email Verification Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

const authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email
    const user = await knex('user').where('email', email).first();

    if (!user) {
      return res.status(404).send({ message: 'Invalid Credentials Email.' });
    }

    // Validate password and account verification status
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isVerified = user.emailVerified;

    if (!isPasswordValid || !isVerified) {
      return res.status(401).send({ message: 'Invalid Credentials.' });
    }

    // Create authentication token
    const token = createAuthToken(user);

    // Store token if it doesn't exist
    const activeToken = await knex('token_log').where('token', token).first();
    if (!activeToken) {
      await knex('token_log').insert({
        token: token,
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'jwt_token',
        status: 'Active',
      });
    }

    return res.status(200).send({
      token: token,
      meta: user.meta,
      message: 'Logged In Successfully.',
    });
  } catch (error) {
    console.log('Error in authentication:', error);
    return res
      .status(500)
      .send({ message: 'Internal Server Error.', error: error.message });
  }
};

module.exports = {
  activateAccount,
  authenticateUser,
}
