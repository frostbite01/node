const { WifiRequestForm, User } = require('../models');

// Create new WiFi request
exports.createRequest = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      submitted_by: req.user.id
    };

    const wifiRequest = await WifiRequestForm.create(formData);

    res.status(201).json({
      message: 'WiFi request created successfully',
      data: wifiRequest
    });
  } catch (error) {
    console.error('Error creating WiFi request:', error);
    res.status(500).json({ message: 'Error creating WiFi request' });
  }
};

// Get all WiFi requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await WifiRequestForm.findAll({
      include: [{
        model: User,
        as: 'submitter',
        attributes: ['username', 'name', 'employeeId', 'department', 'position', 'phoneNumber']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching WiFi requests:', error);
    res.status(500).json({ message: 'Error fetching WiFi requests' });
  }
};

// Get WiFi request by ID
exports.getRequestById = async (req, res) => {
  try {
    const request = await WifiRequestForm.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'submitter',
        attributes: ['username', 'name', 'employeeId', 'department', 'position', 'phoneNumber']
      }]
    });

    if (!request) {
      return res.status(404).json({ message: 'WiFi request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching WiFi request:', error);
    res.status(500).json({ message: 'Error fetching WiFi request' });
  }
};

// Get requests for currently logged in user
exports.getMyRequests = async (req, res) => {
  try {
    console.log("Current user ID:", req.user.id); // Debug user ID

    const requests = await WifiRequestForm.findAll({
      where: {
        submitted_by: req.user.id
      },
      include: [{
        model: User,
        as: 'submitter',
        attributes: ['username', 'name', 'employeeId', 'department', 'position', 'phoneNumber']
      }],
      order: [['createdAt', 'DESC']]
    });

    console.log("Found requests:", requests); // Debug found requests
    return res.json(requests); // Return the array directly

  } catch (error) {
    console.error('Error fetching forms:', error);
    return res.status(500).json({ message: 'Error fetching forms' });
  }
};

// Get requests by user ID (admin only)
exports.getUserRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requests = await WifiRequestForm.findAll({
      where: {
        submitted_by: userId
      },
      include: [{
        model: User,
        as: 'submitter',
        attributes: ['username', 'name', 'employeeId', 'department', 'position', 'phoneNumber']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching user WiFi requests:', error);
    res.status(500).json({ message: 'Error fetching user WiFi requests' });
  }
};