// ALL write/update operation(s) to the database should be logged

const knex = require ("../library/db");

// Create
async function createLog (type, userId, arguments) {
    return await knex("log").insert({ 
        userId, // uuid
        type, // string 
        arguments_passed: JSON.stringify(arguments),
        createdAt: new Date(), // timestampz
      }
    );
}

// Read
async function getLogById (id) {
    return await knex("log").where("id", id).first();
}

// Read
async function getLogsByDate(date) {
    return await knex("log").whereRaw("DATE(createdAt) = ?", [date]);
}  

// Read
async function getAllLogs() {
    return await knex("log").select();
}
  
// Delete
async function deleteLogById (id) {
    return await knex("log").where("id", id).del();
}

module.exports = {
    createLog,
    getLogById,
    getLogsByDate,
    getAllLogs,
    deleteLogById,
}