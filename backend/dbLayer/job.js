const knex = require("../library/db");
const log = require("./log");
require("dotenv").config();

// Create
async function createJob (userId, job) {
  // Check if the same job exists 
  const currJob = await knex("job").where({
      title: job.title,
      companyName: job.companyName,
    }).first();

  if (currJob) return currJob;

  const createdJob = await knex("job").insert({
      title: job.title, // string
      type: job.type, // dropdown [Intern or FTE]
      companyName: job.companyName, //string
      meta: JSON.stringify({
        companyLogo: job.companyLogo || process.env.DEFAULT_COMPANY_LOGO, // string
        description: job.description || "Job description unavailable at the moment.", //string
        compensation: job.compensation || "Job compensation unavailable at the moment.", // float
        compensationDescription: job.compensationDescription || "Compensation description unavailable at the moment.", // string
        eligibleDiscipline: job.eligibleDiscipline || "Eligible discipline(s) not yet defined.", // array, dropdown [Arts, Engineering, Science...]
        eligibleLevel: job.eligibleLevel || "Eligible level(s) not yet defined.", // array, dropdown [B.E, M.Tech, MCA...]
        eligibleDepartment: job.eligibleDepartment || "Eligible department(s) not yet defined.", // array, dropdown [CSE, IT, ETCE...]
        cgpaCutoff: job.cgpaCutoff || "CGPA cutoff not yet decided.", // float, dropdown with interval of .5 from 6-9.5
        allowBacklog: job.allowBacklog || "Not yet decided.", // bool, dropdown
        topNcoders: job.topNcoders || "Eligibility of top coders not yet decided.", // int
        registrationLink: job.registrationLink || "Registration link to be released soon.", // string, TODO: have a Apply Now! button so that forms are not needed anymore;
        externalPortalRegistrationLink: job.externalPortalRegistrationLink || "No external portal(s) yet.", // string
        registrationDeadline: job.registrationDeadline || "Will be updated along with registration link.", // date-time, dropdown
        jdLink: job.jdLink || "JD link unavailable at the moment.", // string
        driveMode: job.driveMode || "Drive mode is not yet decided.", // string, dropdown [Online, Offline, Hybrid]
        pptDate: job.pptDate || "PPT date not yet decided.", // date, dropdown
        oaDate: job.oaDate || "OA date not yet decided.", // date, dropdown
      }), // json
      status: job.status, // bool, stays true until the drive is completely over
      createdAt: new Date(), // timestampz
      updatedAt: new Date(), // timestampz
    }
  );
  await log.createLog(createJob.name, userId, { arguments: Array.from(arguments) });
  return createdJob;
}

// Read
async function getJobById (id) {
  return await knex("job").where("id", id).first();
}

// Read
async function getJobByTitleAndCompanyName (title, companyName) {
  return await knex("job").where({
    title,
    companyName,
  }).first();
}

// Read 
async function getLatestNJobs(N) {
  return await knex("job")
    .select('*')
    .orderBy('updatedAt', 'desc')
    .limit(N);
}

// Update
async function updateJob (userId, id, job) {
  await knex("job").where("id", id).update({ 
    title: job.title, // string
    type: job.type, // dropdown [Intern or FTE]
    companyName: job.companyName, //string
    meta: JSON.stringify({
      companyLogo: job.companyLogo || process.env.DEFAULT_COMPANY_LOGO, // string
      description: job.description || "Job description unavailable at the moment.", //string
      compensation: job.compensation || "Job compensation unavailable at the moment.", // float
      compensationDescription: job.compensationDescription || "Compensation description unavailable at the moment.", // string
      eligibleDiscipline: job.eligibleDiscipline || "Eligible discipline(s) not yet defined.", // array, dropdown [Arts, Engineering, Science...]
      eligibleLevel: job.eligibleLevel || "Eligible level(s) not yet defined.", // array, dropdown [B.E, M.Tech, MCA...]
      eligibleDepartment: job.eligibleDepartment || "Eligible department(s) not yet defined.", // array, dropdown [CSE, IT, ETCE...]
      cgpaCutoff: job.cgpaCutoff || "CGPA cutoff not yet decided.", // float, dropdown with interval of .5 from 6-9.5
      allowBacklog: job.allowBacklog || "Not yet decided.", // bool, dropdown
      topNcoders: job.topNcoders || "Eligibility of top coders not yet decided.", // int
      registrationLink: job.registrationLink || "Registration link to be released soon.", // string, TODO: have a Apply Now! button so that forms are not needed anymore;
      externalPortalRegistrationLink: job.externalPortalRegistrationLink || "No external portal(s) yet.", // string
      registrationDeadline: job.registrationDeadline || "Will be updated along with registration link.", // date-time, dropdown
      jdLink: job.jdLink || "JD link unavailable at the moment.", // string
      driveMode: job.driveMode || "Drive mode is not yet decided.", // string, dropdown [Online, Offline, Hybrid]
      pptDate: job.pptDate || "PPT date not yet decided.", // date, dropdown
      oaDate: job.oaDate || "OA date not yet decided.", // date, dropdown
    }), // json
    status: job.status, // bool, stays true until the drive is completely over
    updatedAt: new Date(), //timestampz
  });
  await log.createLog(updateJob.name, userId, { arguments: Array.from(arguments) });
}

// Delete
async function deleteJob (userId, id) {
  await knex("job").where("id", id).del();
  await log.createLog(deleteJob.name, userId, { arguments: Array.from(arguments) });
}

module.exports = {
  createJob,
  getJobById,
  getJobByTitleAndCompanyName,
  getLatestNJobs,
  updateJob,
  deleteJob,
};
