const db = require('../models');
const Department = db.Department;

// Create a new department
exports.create = async (req, res) => {
  try {
    const newDepartment = await Department.create(req.body);
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ message: 'Error creating department', error: error.message });
  }
};

// Get all departments
exports.findAll = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.status(200).json(departments);
  } catch (error) {
    console.error('Error getting all departments:', error);
    res.status(500).json({ message: 'Error getting all departments', error: error.message });
  }
};

// Get a department by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const department = await Department.findByPk(id);
    if (department) {
      res.status(200).json(department);
    } else {
      res.status(404).json({ message: `Department with id=${id} not found` });
    }
  } catch (error) {
    console.error('Error getting department by ID:', error);
    res.status(500).json({ message: 'Error getting department by ID', error: error.message });
  }
};

// Update a department by ID
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Department.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedDepartment = await Department.findByPk(id);
      res.status(200).json(updatedDepartment);
    } else {
      res.status(404).json({ message: `Cannot update Department with id=${id}. Maybe Department was not found!` });
    }
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ message: 'Error updating department', error: error.message });
  }
};

// Delete a department by ID
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Department.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: `Cannot delete Department with id=${id}. Maybe Department was not found!` });
    }
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ message: 'Error deleting department', error: error.message });
  }
};