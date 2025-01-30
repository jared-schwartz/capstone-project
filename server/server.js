const pg = require("pg")

const { Client } = pg;
const client = new Client({
    user: 'karl',
    password: 'password',
    host: 'localhost',
    port: 5432,
    database: 'drPepper_db',
});

module.exports = {
    client
}