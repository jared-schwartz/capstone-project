const pg = require("pg");
const client = new pg.Client({
    host: "localhost",
    port: 5432,
    user: "karl",
    password: "password",
    database: "drPepper_db"
});
module.exports = {
    client,
};
