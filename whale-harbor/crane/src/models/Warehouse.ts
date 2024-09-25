const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Warehouse = sequelize.define("warehouse", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Warehouse;
