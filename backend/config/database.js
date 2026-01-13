require("dotenv").config();
const { Sequelize } = require("sequelize");
const initModels = require("../models");

const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, { logging: false })
    : new Sequelize(
        process.env.DB_NAME || "instantmessenger",
        process.env.DB_USER || "postgres",
        process.env.DB_PASSWORD || "postgres",
        {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT || 5432),
            dialect: "postgres",
            logging: false
        }
    );

const models = initModels(sequelize);

async function initDatabase() {
    await sequelize.authenticate();
    await sequelize.sync();
}

module.exports = {
    sequelize,
    models,
    initDatabase
};
