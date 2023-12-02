const knex = require ("../library/db");
const log = require("./log");

// Create
async function createDepartment (userId, name) {
    // check if department already exists
    const department = await knex("department").where({ name }).first();
    if (department) return department;

    const createdDepartment = await knex("department").insert({ 
        name, // string 
        createdAt: new Date(), // timestampz
        updatedAt: new Date(), // timestampz 
      }
    );
    await log.createLog(createDepartment.name, userId, {arguments: Array.from(arguments)});
    return createdDepartment;
}

// Read
async function getDepartmentById (id) {
    return await knex("department").where("id", id).first();
}
  
// Read
async function getDepartmentByName (name) {
    return await knex("department").where("name", name).first();
}

// Read
async function getAllDepartments() {
    return await knex("department").select();
}

// Update
async function updateDepartmentById (userId, id, name) {
    await knex("department").where("id", id).update({ name });
    await log.createLog(updateDepartmentById.name, userId, { arguments: Array.from(arguments) });
}

// Update
async function updateDepartmentByName (userId, name, newName) {
    await knex("department").where("name", name).update({ name: newName });
    await log.createLog(updateDepartmentByName.name, userId, { arguments: Array.from(arguments) });
}
  
// Delete
async function deleteDepartmentById (userId, id) {
    await knex("department").where("id", id).del();
    await log.createLog(deleteDepartmentById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteDepartmentByName (userId, name) {
    await knex("department").where("name", name).del();
    await log.createLog(deleteDepartmentByName.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
    createDepartment,
    getDepartmentById,
    getDepartmentByName,
    getAllDepartments,
    updateDepartmentById,
    updateDepartmentByName,
    deleteDepartmentById,
    deleteDepartmentByName,
}