const knex = require("../library/db");
const log = require("./log");
require("dotenv").config();

// Create
async function createNotification (userId, notification) {
  const createdNotification = await knex("notification").insert({
      title: notification.title, // string
      meta: JSON.stringify({
        image: notification.image || process.env.DEFAULT_NOTIFICATION_COVER, // string
        description: notification.description || "No description.", //string
        eligibleDiscipline: notification.eligibleDiscipline || "Eligible discipline(s) not yet defined.", // array, dropdown [Arts, Engineering, Science...]
        eligibleLevel: notification.eligibleLevel || "Eligible level(s) not yet defined.", // array, dropdown [B.E, M.Tech, MCA...]
        eligibleDepartment: notification.eligibleDepartment || "Eligible department(s) not yet defined.", // array, dropdown [CSE, IT, ETCE...]
      }), // json
      createdAt: new Date(), // timestampz
      updatedAt: new Date(), // timestampz
    }
  );
  await log.createLog(createNotification.name, userId, { arguments: Array.from(arguments) });
  return createdNotification;
}

// Read
async function getNotificationById (id) {
  return await knex("notification").where("id", id).first();
}

// Read
async function getNotificationByTitle (title) {
  return await knex("notification").where({ title }).first();
}

// Read 
async function getLatestNNotifications(N) {
  return await knex("notification")
    .select('*')
    .orderBy('updatedAt', 'desc')
    .limit(N);
}

// Update
async function updateNotification (userId, id, notification) {
  await knex("notification").where("id", id).update({ 
    title: notification.title, // string
    meta: JSON.stringify({
        image: notification.image || process.env.DEFAULT_NOTIFICATION_COVER, // string
        description: notification.description || "No description.", //string
        eligibleDiscipline: notification.eligibleDiscipline || "Eligible discipline(s) not yet defined.", // array, dropdown [Arts, Engineering, Science...]
        eligibleLevel: notification.eligibleLevel || "Eligible level(s) not yet defined.", // array, dropdown [B.E, M.Tech, MCA...]
        eligibleDepartment: notification.eligibleDepartment || "Eligible department(s) not yet defined.", // array, dropdown [CSE, IT, ETCE...]
      }), // json
    updatedAt: new Date(), //timestampz
  });
  await log.createLog(updateNotification.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteNotification (userId, id) {
  await knex("notification").where("id", id).del();
  await log.createLog(deleteNotification.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
  createNotification,
  getNotificationById,
  getNotificationByTitle,
  getLatestNNotifications,
  updateNotification,
  deleteNotification,
};
