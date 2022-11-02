const Sequelize = require('sequelize');
const sequelize =  require('../util/database');
const user = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
      }
});
module.exports=user;