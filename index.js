
const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_PASS,
});

connection.connect((err) => {
    if(err) throw err;
    console.log("Connected at " + connection.threadId + "\n");
    connection.end()
});

