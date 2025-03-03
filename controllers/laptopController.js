const { Laptop } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(Laptop, 'Laptop'); 