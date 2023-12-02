const notificationDBLayer = require("../dbLayer/notification");
const userDBLayer = require("../dbLayer/user");
require("dotenv").config();

function hasSufficientDetails (user) {
    return user.meta.discipline && user.meta.level && user.meta.department;
}

function isEligible (user, notification) {
    const isDisciplineArray = Array.isArray(notification.meta.eligibleDiscipline);
    const isLevelArray = Array.isArray(notification.meta.eligibleLevel);
    const isDepartmentArray = Array.isArray(notification.meta.eligibleDepartment);

    if (isDisciplineArray && isLevelArray && isDepartmentArray) {
        return notification.meta.eligibleDiscipline.includes(user.meta.discipline) &&
               notification.meta.eligibleLevel.includes(user.meta.level) &&
               notification.meta.eligibleDepartment.includes(user.meta.department);
    }

    if (isDisciplineArray && isLevelArray) {
        return notification.meta.eligibleDiscipline.includes(user.meta.discipline) &&
               notification.meta.eligibleLevel.includes(user.meta.level);
    }

    if (isDisciplineArray) return notification.meta.eligibleDiscipline.includes(user.meta.discipline);

    return true;
}

// GPT-4 COMPRESSED THE ABOVE FUNCTION TO:
// function isEligible(user, notification) {
//     return (!Array.isArray(notification.meta.eligibleDiscipline) || notification.meta.eligibleDiscipline.includes(user.meta.discipline)) &&
//            (!Array.isArray(notification.meta.eligibleLevel) || notification.meta.eligibleLevel.includes(user.meta.level)) &&
//            (!Array.isArray(notification.meta.eligibleDepartment) || notification.meta.eligibleDepartment.includes(user.meta.department));
// }

async function getRelevantNotifications (userId) {
    const notifications = await notificationDBLayer.getLatestNNotifications(process.env.NOTIFICATION_COUNT);
    const user = await userDBLayer.getUserById(userId);

    if(!hasSufficientDetails(user)) return notifications;

    return notifications.filter(notification => isEligible(user, notification));
}

async function createNotification (userId, notification) {
    return await notificationDBLayer.createNotification(userId, notification);
}

async function updateNotification (userId, notification) {
    await notificationDBLayer.updateNotification(userId, notification.id, notification);
}

module.exports = {
    getRelevantNotifications,
    createNotification,
    updateNotification,
}