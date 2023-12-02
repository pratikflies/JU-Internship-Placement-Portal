const knex = require("../lib/db");
const log = require("./log")

// Create
async function createDisciplineLevel (userId, disciplineId, levelId) {
  const disciplineLevel = await knex("disciplineLevel").where({ disciplineId, levelId }).first();
  if (disciplineLevel) return disciplineLevel;

  const createdDisciplineLevel = await knex("disciplineLevel").insert({
    disciplineId, // int 
    levelId, // int 
    createdAt: new Date(), // timestampz
    updatedAt: new Date(), // timestampz 
  });
  await log.createLog(createDisciplineLevel.name, userId, { arguments: Array.from(arguments) });
  return createdDisciplineLevel;
}

// Read
async function getDisciplineLevelById (disciplineLevelId) {
  return await knex("disciplineLevel").where("id", disciplineLevelId).first();
}

// Read
async function getDisciplineLevelByCombinationId (disciplineId, levelId) {
  return await knex("disciplineLevel").where({ disciplineId, levelId }).first();
}

// Read
async function getDisciplineLevelByNames (disciplineName, levelName) {
  return await knex("disciplineLevel as dl")
    .join("discipline as d", "dl.disciplineId", "d.id")
    .join("level as l", "dl.levelId", "l.id")
    .where({ "d.name": disciplineName, "l.name": levelName })
    .select("dl.*", "d.name as disciplineName", "l.name as levelName")
    .first();
}

// Read
async function getDisciplineLevelByDisciplineId (disciplineId) {
  return await knex("disciplineLevel").where("disciplineId", disciplineId).select();
}

// Update
async function updateDisciplineLevelById (userId, disciplineLevelId, newDisciplineId, newLevelId) {
  await knex("disciplineLevel").where("id", disciplineLevelId).update({
    disciplineId: newDisciplineId,
    levelId: newLevelId,
  });
  await log.createLog(updateDisciplineLevelById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteDisciplineLevelById (userId, disciplineLevelId) {
  await knex("disciplineLevel").where("id", disciplineLevelId).del();
  await log.createLog(deleteDisciplineLevelById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteDisciplineLevelByCombinationId (userId, disciplineId, levelId) {
  await knex("disciplineLevel").where({ disciplineId, levelId }).del();
  await log.createLog(deleteDisciplineLevelByCombinationId.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
  createDisciplineLevel,
  getDisciplineLevelById,
  getDisciplineLevelByCombinationId,
  getDisciplineLevelByNames,
  getDisciplineLevelByDisciplineId,
  updateDisciplineLevelById,
  deleteDisciplineLevelById,
  deleteDisciplineLevelByCombinationId,
};
