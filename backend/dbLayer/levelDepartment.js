const knex = require("../lib/db");
const log = require("./log");

// Create
async function createLevelDepartment (userId, levelId, departmentId) {
  const levelDepartment = await knex("levelDepartment").where({ levelId, departmentId }).first();
  if (levelDepartment) return levelDepartment;

  const createdLevelDepartment = await knex("levelDepartment").insert({
    levelId, // int 
    departmentId, // int 
    createdAt: new Date(), // timestampz
    updatedAt: new Date(), // timestampz 
  });
  await log.createLog(createLevelDepartment.name, userId, { arguments: Array.from(arguments) });
  return createdLevelDepartment;
}

// Read
async function getLevelDepartmentById (levelDepartmentId) {
  return await knex("levelDepartment").where("id", levelDepartmentId).first();
}

// Read
async function getLevelDepartmentByCombinationId (levelId, departmentId) {
  return await knex("levelDepartment").where({ levelId, departmentId }).first();
}

// Read
async function getLevelDepartmentByNames (levelName, departmentName) {
  return await knex("levelDepartment as dl")
    .join("level as d", "dl.levelId", "d.id")
    .join("department as l", "dl.departmentId", "l.id")
    .where({ "d.name": levelName, "l.name": departmentName })
    .select("dl.*", "d.name as levelName", "l.name as departmentName")
    .first();
}

// Read
async function getLevelDepartmentByLevelId (levelId) {
    return await knex("levelDepartment").where("levelId", levelId).select();
}

// Update
async function updateLevelDepartmentById (userId, levelDepartmentId, newLevelId, newDepartmentId) {
  await knex("levelDepartment").where("id", levelDepartmentId).update({
    levelId: newLevelId,
    departmentId: newDepartmentId,
  }); 
  await log.createLog(updateLevelDepartmentById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteLevelDepartmentById (userId, levelDepartmentId) {
  await knex("levelDepartment").where("id", levelDepartmentId).del();
  await log.createLog(deleteLevelDepartmentById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteLevelDepartmentByCombinationId (userId, levelId, departmentId) {
  await knex("levelDepartment").where({ levelId, departmentId }).del();
  await log.createLog(deleteLevelDepartmentByCombinationId.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
  createLevelDepartment,
  getLevelDepartmentById,
  getLevelDepartmentByCombinationId,
  getLevelDepartmentByNames,
  getLevelDepartmentByLevelId,
  updateLevelDepartmentById,
  deleteLevelDepartmentById,
  deleteLevelDepartmentByCombinationId,
};
