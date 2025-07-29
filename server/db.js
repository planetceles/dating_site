const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "DataChance2!",
    database: "dating_app",
});

module.exports = pool.promise();