const { AccessPoint } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(AccessPoint, 'Access Point'); 