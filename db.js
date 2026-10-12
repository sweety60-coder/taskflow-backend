// =======================================
// TaskFlow Pro X - Database Connection
// =======================================

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({

    host: process.env.DB_HOST,

    port: process.env.DB_PORT,

    user: process.env.DB_USER,

    password: process.env.DB_PASSWORD,

    database: process.env.DB_NAME,

    waitForConnections: true,

    connectionLimit: 10,

    queueLimit: 0

});



// Test Connection

pool.getConnection()
.then(connection => {

    console.log(
        "MySQL Connected Successfully"
    );

    connection.release();

})
.catch(error => {

    console.log(
        "Database Connection Error:",
        error.message
    );

});



module.exports = pool;