const { Software } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(Software, 'Software'); 