const { CCTVRequestForm, User } = require('../models');

exports.createRequest = async (req, res) => {
  try {
    const formData = {
      ...req.body,
      submitted_by: req.user.id
    };

    const cctvRequest = await CCTVRequestForm.create(formData);

    res.status(201).json({
      message: 'CCTV request created successfully',
      data: cctvRequest
    });
  } catch (error) {
    console.error('Error creating CCTV request:', error);
    res.status(500).json({ message: 'Error creating CCTV request' });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await CCTVRequestForm.findAll({
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