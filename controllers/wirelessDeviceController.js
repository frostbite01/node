const { WirelessDevice } = require('../models');
const createInventoryController = require('./inventoryController');

module.exports = createInventoryController(WirelessDevice, 'Wireless Device'); 