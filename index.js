const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.PORT || 1154,
    user: process.env.USER,
    password: process.env.PASS,
})