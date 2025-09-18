const { SoftwareRequestForm, User } = require('../models');

exports.createRequest = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      submitted_by: req.user.id
    };

    const softwareRequest = await SoftwareRequestForm.create(formData);

    res.status(201).json({
      message: 'Software request created successfully',
      data: softwareRequest
    });
  } catch (error) {
    console.error('Error creating software request:', error);
    res.status(500).json({ message: 'Error creating software request' });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await SoftwareRequestForm.findAll({
      where: { submitted_by: req.user.id },
      include: [{
        model: User,
        as: 'submitter',
        attributes: ['username', 'name', 'department']
      }],
      order: [['createdAt', 'DESC']]
    });

    return res.json(requests);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};