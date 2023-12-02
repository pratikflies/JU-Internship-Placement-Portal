const knex = require ("../library/db");
const log = require("./log");

// Create
async function createDiscipline (userId, name) {
    // check if discipline already exists
    const discipline = await knex("discipline").where({ name }).first();
    if (discipline) return discipline;

    const createdDiscipline = await knex("discipline").insert({ 
        name, // string 
        createdAt: new Date(), // timestampz
        updatedAt: new Date(), // timestampz 
      }
    );
    await log.createLog(createDiscipline.name, userId, { arguments: Array.from(arguments) });
    return createdDiscipline;
}

// Read
async function getDisciplineById (id) {
    return await knex("discipline").where("id", id).first();
}
  
// Read
async function getDisciplineByName (name) {
    return await knex("discipline").where("name", name).first();
}

// Read
async function getAllDisciplines() {
    return await knex("discipline").select();
}

// Update
async function updateDisciplineById (userId, id, name) {
    await knex("discipline").where("id", id).update({ name });
    await log.createLog(updateDisciplineById.name, userId, { arguments: Array.from(arguments) });
}

// Update
async function updateDisciplineByName (userId, name, newName) {
    await knex("discipline").where("name", name).update({name: newName});
    await log.createLog(updateDisciplineByName.name, userId, { arguments: Array.from(arguments) });
}
  
// Delete
async function deleteDisciplineById (userId, id) {
    await knex("discipline").where("id", id).del();
    await log.createLog(deleteDisciplineById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteDisciplineByName (userId, name) {
    await knex("discipline").where("name", name).del();
    await log.createLog(deleteDisciplineByName.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
    createDiscipline,
    getDisciplineById,
    getDisciplineByName,
    getAllDisciplines,
    updateDisciplineById,
    updateDisciplineByName,
    deleteDisciplineById,
    deleteDisciplineByName,
}