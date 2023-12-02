const knex = require("../library/db");
const log = require("./log");
require("dotenv").config();

async function updateUser (id, user) {
    try {
      await knex("user").where("id", id).update({
        name: user.name, // string
        meta: JSON.stringify({
          image: user.image || process.env.DEFAULT_PFP, // string
          phone: user.phone, // string
          gender: user.gender, // string, dropdown [Male, Female, Other]
          dob: user.dob, // date, dropdown
          pwd: user.pwd, // bool, dropdown
          discipline: user.discipline, // string, dropdown [Arts, Engineering, Science...]
          level: user.level, // string, dropdown [UG, PG...]
          department: user.department, // string, dropdown [CSE, IT, ETCE...]
          year: user.year, // int, dropdown [3, 4]
          semester: user.semester, // int, dropdown [5, 6, 7, 8]
          rollNumber: user.rollNumber, // string
          cgpa: user.cgpa, // float
          backlog: user.backlogs, // dropdown [Yes, No]
          classXPercentage: user.classXPercentage, // float
          classXIIPercentage: user.classXIIPercentage || "N/A", // float
          diplomaPercentage: user.diplomaPercentage || "N/A", // float
          ugCgpa: user.ugCgpa || "N/A", // float, for non-UG students
          resumeLink: user.resumeLink, // string
        }), // json
        status: user.status, // bool, dropdown
        updatedAt: new Date(), // timestampz
      });
      await log.createLog(updateUser.name, id, { arguments: Array.from(arguments) });
    } catch (err) {
      console.log("Error saving user details: ", err);
      return res
        .status(500)
        .json({ message: "Saving user details failed.", err: err.message });
    }
}
  
async function getUserById (id) {
    try {
      return await knex("user").where("id", id).first();
    } catch (err) {
      console.log("Error fetching user: ", err)
      return res
        .status(500)
        .json({ message: "Fetching user failed", err: err.message });
    }
}

module.exports = {
  updateUser,
  getUserById,
};