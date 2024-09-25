const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Whale = sequelize.define("whale", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  warehouse: DataTypes.STRING,
  status: {
    type: DataTypes.ENUM("staging", "traveling"),
    defaultValue: "staging"
  },
  arrival: DataTypes.DATE,
  departure: DataTypes.DATE,
});

module.exports = Whale;
