const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/database.js')[env];
const db = {};

// Create a new Sequelize instance without specifying the database
const sequelizeWithoutDb = new Sequelize(
  '', // Empty database name
  config.username,
  config.password, 
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

// Function to create database if it doesn't exist
const initializeDatabase = async () => {
  try {
    // Try to create the database if it doesn't exist
    await sequelizeWithoutDb.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    console.log(`Database ${config.database} checked/created successfully`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    // Close the connection
    await sequelizeWithoutDb.close();
  }
};

// Create a Sequelize instance with the database specified
let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool
  }
);

// Load all models
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.initializeDatabase = initializeDatabase;

module.exports = db; 