const { CctvNvr } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(CctvNvr, 'CCTV/NVR'); 