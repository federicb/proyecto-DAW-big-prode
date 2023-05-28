const mysql = require("mysql2/promise");
const { database_dev, database_prod } = require("./keys");

let db_active;

console.log("database =", process.env.NODE_ENV);

if ( process.env.NODE_ENV == "development" ){
    db_active = database_dev;
} else {
    db_active = database_prod;
}

const pool = mysql.createPool(db_active);

module.exports = pool;