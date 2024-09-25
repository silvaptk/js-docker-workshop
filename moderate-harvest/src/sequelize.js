const { Sequelize } = require("sequelize");
const env = require("dotenv")

env.config()

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: 3306,
});

module.exports = sequelize;
