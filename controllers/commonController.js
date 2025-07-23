const db = require('../models');
const Location = db.Location;
const Department = db.Department;

// Get all departments and locations
exports.getLocationsAndDepartments = async (req, res) => {
  try {
    const locations = await Location.findAll();
    const departments = await Department.findAll();

    res.status(200).json({ locations: locations, departments: departments });
  } catch (error) {
    console.error('Error getting all departments and locations:', error);
    res.status(500).json({ message: 'Error getting all departments and locations', error: error.message });
  }
};