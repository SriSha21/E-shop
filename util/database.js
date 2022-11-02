// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'nodecomplete'
// });

// module.exports = pool.promise(); ------ this code used to connect without sequelizing



const Sequelize  = require('sequelize');

const sequelize = new Sequelize('srinode','hbstudent','hbstudent',{dialect:'mysql',host:'localhost'});
module.exports = sequelize;