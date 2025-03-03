const { Peripheral } = require('../models');
const createInventoryController = require('./inventoryController');

const peripheralController = createInventoryController(Peripheral, 'Peripheral');

// Add peripheral-specific controller methods
peripheralController.getByType = async (req, res) => {
  try {
    const { type } = req.params;
    const items = await Peripheral.findAll({
      where: { type }
    });
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching peripherals by type:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = peripheralController; 