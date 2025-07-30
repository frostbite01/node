const { Form } = require('../models');

// Get all forms (with role-based filtering)
exports.getForms = async (req, res) => {
  try {
    const userRole = req.user.role;
    
    const forms = await Form.findAll({
      where: {
        isActive: true,
        requiredRole: userRole
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Error fetching forms' });
  }
};

// Get form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ message: 'Error fetching form' });
  }
};

// Create new form (admin only)
exports.createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ message: 'Error creating form' });
  }
};

// Update form (admin only)
exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    await form.update(req.body);
    res.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ message: 'Error updating form' });
  }
};

// Delete form (admin only)
exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    await form.destroy();
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ message: 'Error deleting form' });
  }
};

// Get forms by category
exports.getFormsByCategory = async (req, res) => {
  try {
    const userRole = req.user.role;
    const { category } = req.params;

    const forms = await Form.findAll({
      where: {
        category,
        isActive: true,
        requiredRole: userRole
      },
      order: [['updatedAt', 'DESC']]
    });

    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms by category:', error);
    res.status(500).json({ message: 'Error fetching forms' });
  }
};