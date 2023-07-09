const Sequelize = require("sequelize");

const sequelize = new Sequelize("expense-fullstack", "root", "root2000", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
