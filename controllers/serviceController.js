// controllers/serviceController.js
const { ServiceType } = require('../models');

exports.createServiceType = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const serviceType = await ServiceType.create({ name, description });
    res.status(201).json({ success: true, serviceType });
  } catch (error) {
    console.error('Error creating service type:', error);
    res.status(500).json({ message: 'Error creating service type' });
  }
};
