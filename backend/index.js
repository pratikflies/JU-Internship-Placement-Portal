const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const { authMiddleware } = require("./middleware/auth");
const knex = require("./library/db");
const auth = require("./library/auth");
const user = require("./library/user");

const dashboardAction = require("./action/dashboard");
const notificationAction = require("./action/notification");
const jobAction = require("./action/job");
const userAction = require("./action/user");

// UN-AUTHENTICATED ROUTES

// API endpoint to check if server is up
app.get ("/health", async (req, res) => {
    res.status(201).json({ res: "Success" });
});

// API endpoint for login
app.post ("/login", async (req, res) => {
    return await auth.authenticateUser(req, res);
});

// API enpoint for user signup
app.post ("/signup", async (req, res) => {
    return await user.registerUser(req, res);
});
  
// API endpoint to activate account
app.get ("/activate-account/:token", auth.activateAccount);

// AUTHENTICATED ROUTES
app.use (authMiddleware);

app.post ("/me", async (req, res) => {
    return await user.me(req, res);
});

app.post ("/user-detail", async (req,res) => {
    await userAction.updateUser(req.userId, req.body);
    res.json({ message: "Successfully updated user details." });
});

app.get ("/user-detail", async (req,res) => {
    return await userAction.getUserById(req.userId);
});

app.post ("/create-job", async (req,res) => {
    return await jobAction.createJob(req.userId, req.body);
});

app.post ("/update-job", async (req,res) => {
    await jobAction.updateJob(req.userId, req.body);
    res.json({ message: "Successfully updated job details." });
});

app.get ("/get-job", async (req,res) => {
    return await jobAction.getRelevantJobs(req.userId);
});

app.post ("/create-notification", async (req,res) => {
    return await notificationAction.createNotification(req.userId, req.body);
});

app.post ("/update-notification", async (req,res) => {
    await notificationAction.updateNotification(req.userId, req.body);
    res.json({ message: "Successfully updated notification details." });
});

app.get ("/get-notification", async (req,res) => {
    return await notificationAction.getRelevantNotifications(req.userId);
});

app.post ("/logout", async (req, res) => {
    const token = req.body.token;
    await knex("token_log").where("token", token).del();
    res.json({ message: "Successfully Logged Out" });
});

app.listen (process.env.PORT || 3001, async () => {
    const port = process.env.PORT || 3001
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;