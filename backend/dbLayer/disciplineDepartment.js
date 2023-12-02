const knex = require("../lib/db");
const log = require("./log");

// Create
async function createDisciplineDepartment (userId, disciplineId, departmentId) {
  const disciplineDepartment = await knex("disciplineDepartment").where({ disciplineId, departmentId }).first();
  if (disciplineDepartment) return disciplineDepartment;

  const createdDisciplineDepartmentawait = knex("disciplineDepartment").insert({
    disciplineId, // int 
    departmentId, // int 
    createdAt: new Date(), // timestampz
    updatedAt: new Date(), // timestampz 
  });
  await log.createLog(createDisciplineDepartment.name, userId, { arguments: Array.from(arguments) });
  return createdDisciplineDepartmentawait;
}

// Read
async function getDisciplineDepartmentById (disciplineDepartmentId) {
  return await knex("disciplineDepartment").where("id", disciplineDepartmentId).first();
}

// Read
async function getDisciplineDepartmentByCombinationId (disciplineId, departmentId) {
  return await knex("disciplineDepartment").where({disciplineId, departmentId}).first();
}

// Read
async function getDisciplineDepartmentByNames (disciplineName, departmentName) {
  return await knex("disciplineDepartment as dl")
    .join("discipline as d", "dl.disciplineId", "d.id")
    .join("department as l", "dl.departmentId", "l.id")
    .where({ "d.name": disciplineName, "l.name": departmentName })
    .select("dl.*", "d.name as disciplineName", "l.name as departmentName")
    .first();
}

// Read
async function getDisciplineDepartmentByDisciplineId (disciplineId) {
    return await knex("disciplineDepartment").where("disciplineId", disciplineId).select();
}

// Update
async function updateDisciplineDepartmentById (userId, disciplineDepartmentId, newDisciplineId, newDepartmentId) {
  await knex("disciplineDepartment").where("id", disciplineDepartmentId).update({
    disciplineId: newDisciplineId,
    departmentId: newDepartmentId,
  });
  await log.createLog(updateDisciplineDepartmentById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteDisciplineDepartmentById (userId, disciplineDepartmentId) {
  await knex("disciplineDepartment").where("id", disciplineDepartmentId).del();
  await log.createLog(deleteDisciplineDepartmentById.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteDisciplineDepartmentByCombinationId (userId, disciplineId, departmentId) {
  await knex("disciplineDepartment").where({ disciplineId, departmentId }).del();
  await log.createLog(deleteDisciplineDepartmentByCombinationId.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
  createDisciplineDepartment,
  getDisciplineDepartmentById,
  getDisciplineDepartmentByCombinationId,
  getDisciplineDepartmentByNames,
  getDisciplineDepartmentByDisciplineId,
  updateDisciplineDepartmentById,
  deleteDisciplineDepartmentById,
  deleteDisciplineDepartmentByCombinationId,
};
