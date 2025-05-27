const mysql = require('mysql');
const path = require('path');
require('dotenv').config({ path : path.join(__dirname, './dbPoolEnv.env') });

// db connect
var dbConfig = {
    host     : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
};

const pool = mysql.createPool(dbConfig);

function getConnectionPool(callback){
    pool.getConnection((err,conn) =>{
        if(!err) callback(conn)
    });
}

console.log(getConnectionPool);

module.exports = {getConnectionPool};