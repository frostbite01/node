const { Printer } = require('../models');
const createInventoryController = require('./inventoryController');

const printerController = createInventoryController(Printer, 'Printer');

// Add any printer-specific controller methods here
printerController.getByNetworkEnabled = async (req, res) => {
  try {
    const { enabled } = req.params;
    const items = await Printer.findAll({
      where: { network_enabled: enabled === 'true' }
    });
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching printers by network status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = printerController; 