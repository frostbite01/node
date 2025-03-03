const { Switch } = require('../models');
const createInventoryController = require('./inventoryController');

const switchController = createInventoryController(Switch, 'Switch');

// Add any switch-specific controller methods here
switchController.getByVlanSupport = async (req, res) => {
  try {
    const { supported } = req.params;
    const items = await Switch.findAll({
      where: { vlan_supported: supported === 'true' }
    });
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching switches by VLAN support:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = switchController; 