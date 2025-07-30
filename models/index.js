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

// Load all models from main directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Load service models from services directory
const ServiceType = require('./services/serviceType')(sequelize, Sequelize.DataTypes);
const ServiceRequirement = require('./services/serviceRequirement')(sequelize, Sequelize.DataTypes);
const ServiceRequest = require('./services/serviceRequest')(sequelize, Sequelize.DataTypes);
const ServiceRequestFile = require('./services/serviceRequestFile')(sequelize, Sequelize.DataTypes);

// Add service models to db object
db.ServiceType = ServiceType;
db.ServiceRequirement = ServiceRequirement;
db.ServiceRequest = ServiceRequest;
db.ServiceRequestFile = ServiceRequestFile;

// Set up associations AFTER all models are loaded
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define inventory associations
db.Location.hasMany(db.Switch, { foreignKey: 'locationId' });
db.Department.hasMany(db.Switch, { foreignKey: 'departmentId' });
db.Switch.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.Switch.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.PC, { foreignKey: 'locationId' });
db.Department.hasMany(db.PC, { foreignKey: 'departmentId' });
db.PC.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.PC.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.Laptop, { foreignKey: 'locationId' });
db.Department.hasMany(db.Laptop, { foreignKey: 'departmentId' });
db.Laptop.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.Laptop.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.Printer, { foreignKey: 'locationId' });
db.Department.hasMany(db.Printer, { foreignKey: 'departmentId' });
db.Printer.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.Printer.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.Peripheral, { foreignKey: 'locationId' });
db.Department.hasMany(db.Peripheral, { foreignKey: 'departmentId' });
db.Peripheral.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.Peripheral.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.Router, { foreignKey: 'locationId' });
db.Department.hasMany(db.Router, { foreignKey: 'departmentId' });
db.Router.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.Router.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.WirelessDevice, { foreignKey: 'locationId' });
db.Department.hasMany(db.WirelessDevice, { foreignKey: 'departmentId' });
db.WirelessDevice.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.WirelessDevice.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.CctvNvr, { foreignKey: 'locationId' });
db.Department.hasMany(db.CctvNvr, { foreignKey: 'departmentId' });
db.CctvNvr.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.CctvNvr.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.AccessPoint, { foreignKey: 'locationId' });
db.Department.hasMany(db.AccessPoint, { foreignKey: 'departmentId' });
db.AccessPoint.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.AccessPoint.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

db.Location.hasMany(db.Software, { foreignKey: 'locationId' });
db.Department.hasMany(db.Software, { foreignKey: 'departmentId' });
db.Software.belongsTo(db.Location, { foreignKey: 'locationId', as: 'locationInfo' });
db.Software.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'departmentInfo' });

// Add image associations for each inventory model
const inventoryModels = ['Switch', 'PC', 'Laptop', 'Printer', 'Peripheral', 
                        'Router', 'WirelessDevice', 'CctvNvr', 'AccessPoint', 'Software'];

inventoryModels.forEach(modelName => {
  // Each inventory model can have many images
  db[modelName].hasMany(db.Image, {
    foreignKey: 'inventoryId',
    constraints: false,
    scope: {
      inventoryType: modelName
    },
    as: 'images'
  });

  // Each image belongs to an inventory item
  db.Image.belongsTo(db[modelName], {
    foreignKey: 'inventoryId',
    constraints: false,
    as: modelName.toLowerCase()
  });
});

// === Service Request Related Associations ===
// Only set up service associations if the models exist
if (db.ServiceType && db.ServiceRequirement) {
  db.ServiceType.hasMany(db.ServiceRequirement, { foreignKey: 'serviceTypeId' });
  db.ServiceRequirement.belongsTo(db.ServiceType, { foreignKey: 'serviceTypeId' });
}

if (db.ServiceType && db.ServiceRequest) {
  db.ServiceType.hasMany(db.ServiceRequest, { foreignKey: 'serviceTypeId' });
  db.ServiceRequest.belongsTo(db.ServiceType, { foreignKey: 'serviceTypeId' });
}

if (db.User && db.ServiceRequest) {
  db.User.hasMany(db.ServiceRequest, { foreignKey: 'userId' });
  db.ServiceRequest.belongsTo(db.User, { foreignKey: 'userId' });
}

if (db.ServiceRequest && db.ServiceRequestFile) {
  db.ServiceRequest.hasMany(db.ServiceRequestFile, { foreignKey: 'serviceRequestId' });
  db.ServiceRequestFile.belongsTo(db.ServiceRequest, { foreignKey: 'serviceRequestId' });
}

if (db.ServiceRequirement && db.ServiceRequestFile) {
  db.ServiceRequirement.hasMany(db.ServiceRequestFile, { foreignKey: 'requirementId' });
  db.ServiceRequestFile.belongsTo(db.ServiceRequirement, { foreignKey: 'requirementId' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.initializeDatabase = initializeDatabase;

module.exports = db;