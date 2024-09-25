const { DataTypes } = require("sequelize");

const sequelize = require("../sequelize");

const Batch = sequelize.define("Batch", {
  status: {
    type: DataTypes.ENUM("dead", "growing", "ready", "untouched"),
    allowNull: false,
    defaultValue: "untouched",
  },
  name: DataTypes.STRING,
});

module.exports = Batch;
