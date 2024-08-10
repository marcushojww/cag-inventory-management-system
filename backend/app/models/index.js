require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const { Sequelize, DataTypes } = require("sequelize");

// Conditionally set the db config for different environments
let sequelize;

if (process.env.NODE_ENV === "development") {
  sequelize = new Sequelize(
    process.env.DB_SCHEMA,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      port: process.env.DB_PORT,
      operatorAliases: false,
    }
  );
} else if (process.env.NODE_ENV === "test") {
  sequelize = new Sequelize({
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE,
    logging: false,
  });
}

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};

db.inventoryItem = require("./item.model.js")(sequelize, DataTypes);

module.exports = db;
