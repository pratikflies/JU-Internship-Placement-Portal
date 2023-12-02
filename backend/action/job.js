const jobDBLayer = require("../dbLayer/job");
const userDBLayer = require("../dbLayer/user");
require("dotenv").config();

function hasSufficientDetails (user) {
    return user.meta.discipline && user.meta.level && user.meta.department;
}

function isEligible (user, job) {
    const isDisciplineArray = Array.isArray(job.meta.eligibleDiscipline);
    const isLevelArray = Array.isArray(job.meta.eligibleLevel);
    const isDepartmentArray = Array.isArray(job.meta.eligibleDepartment);

    if (isDisciplineArray && isLevelArray && isDepartmentArray) {
        return job.meta.eligibleDiscipline.includes(user.meta.discipline) &&
               job.meta.eligibleLevel.includes(user.meta.level) &&
               job.meta.eligibleDepartment.includes(user.meta.department);
    }

    if (isDisciplineArray && isLevelArray) {
        return job.meta.eligibleDiscipline.includes(user.meta.discipline) &&
               job.meta.eligibleLevel.includes(user.meta.level);
    }

    if(isDisciplineArray) return job.meta.eligibleDiscipline.includes(user.meta.discipline);

    return true;
}

// GPT-4 COMPRESSED THE ABOVE FUNCTION TO:
// function isEligible(user, job) {
//     return (!Array.isArray(job.meta.eligibleDiscipline) || job.meta.eligibleDiscipline.includes(user.meta.discipline)) &&
//            (!Array.isArray(job.meta.eligibleLevel) || job.meta.eligibleLevel.includes(user.meta.level)) &&
//            (!Array.isArray(job.meta.eligibleDepartment) || job.meta.eligibleDepartment.includes(user.meta.department));
// }

async function getRelevantJobs (userId) {
    const jobs = await jobDBLayer.getLatestNJobs(process.env.JOB_COUNT);
    const user = await userDBLayer.getUserById(userId);

    if(!hasSufficientDetails(user)) return jobs;

    return jobs.filter(job => isEligible(user, job));
}

async function createJob (userId, job) {
    return await jobDBLayer.createJob(userId, job);
}

async function updateJob (userId, job) {
    await jobDBLayer.updateJob(userId, job.id, job);
}

module.exports = {
    getRelevantJobs,
    createJob,
    updateJob,
}