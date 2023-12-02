const knex = require("knex")({
    client: "pg", // Specify the database client (e.g., pg for PostgreSQL)
    connection: {
      host: "db",
      user: "postgres",
      password: "",
      database: "salesup_local",
    },
});
  
module.exports = knex;
  