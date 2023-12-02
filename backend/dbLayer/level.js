const knex = require ("../library/db");
const log = require("./log");

// Create
async function createLevel (userId, name) {
    // check if level already exists
    const level = await knex("level").where({ name }).first();
    if (level) return level;

    const createdLevel = await knex("level").insert({ 
        name, // string 
        createdAt: new Date(), // timestampz
        updatedAt: new Date(), // timestampz 
      }
    );
    await log.createLog(createLevel.name, userId, { arguments: Array.from(arguments) });
    return createdLevel;
}

// Read
async function getLevelById (id) {
    return await knex("level").where("id", id).first();
}
  
// Read
async function getLevelByName (name) {
    return await knex("level").where("name", name).first();
}

// Read
async function getAllLevels() {
    return await knex("level").select();
}

// Update
async function updateLevelById (userId, id, name) {
    await knex("level").where("id", id).update({ name });
    await log.createLog(updateLevelById.name, userId, { arguments: Array.from(arguments) });
}

// Update
async function updateLevelByName (userId, name, newName) {
    await knex("level").where("name", name).update({ name: newName });
    await log.createLog(updateLevelByName.name, userId, { arguments: Array.from(arguments) });
}
  
// Delete
async function deleteLevelById (userId, id) {
    await knex("level").where("id", id).del();
    await log.createLog(deleteLevelById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteLevelByName (userId, name) {
    await knex("level").where("name", name).del();
    await log.createLog(deleteLevelByName.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
    createLevel,
    getLevelById,
    getLevelByName,
    getAllLevels,
    updateLevelById,
    updateLevelByName,
    deleteLevelById,
    deleteLevelByName,
}