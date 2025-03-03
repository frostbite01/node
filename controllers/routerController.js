const { Router } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(Router, 'Router'); 