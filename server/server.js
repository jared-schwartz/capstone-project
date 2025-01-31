const pg = require("pg");
const client = new pg.Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "root",
});
module.exports = {
  client,
};
