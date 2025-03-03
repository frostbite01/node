const { PC } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(PC, 'PC'); 