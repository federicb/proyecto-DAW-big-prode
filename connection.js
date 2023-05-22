const mysql = require("mysql2/promise");

const { dev_database } = require("./keys");
const pool = mysql.createPool(dev_database);


module.exports = pool;