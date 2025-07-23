const db = require('../models');
const Location = db.Location;
const Department = db.Department; // Import the Department model

// Create a new location
exports.create = async (req, res) => {
  try {
    const newLocation = await Location.create(req.body);
    res.status(201).json(newLocation);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Error creating location', error: error.message });
  }
};

// Get all locations
exports.findAll = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).json(locations);
  } catch (error) {
    console.error('Error getting all locations:', error);
    res.status(500).json({ message: 'Error getting all locations', error: error.message });
  }
};

// Get a location by ID
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const location = await Location.findByPk(id);
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ message: `Location with id=${id} not found` });
    }
  } catch (error) {
    console.error('Error getting location by ID:', error);
    res.status(500).json({ message: 'Error getting location by ID', error: error.message });
  }
};

// Update a location by ID
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const [updated] = await Location.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedLocation = await Location.findByPk(id);
      res.status(200).json(updatedLocation);
    } else {
      res.status(404).json({ message: `Cannot update Location with id=${id}. Maybe Location was not found!` });
    }
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// Delete a location by ID
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await Location.destroy({
      where: { id: id }
    });

    if (deleted) {
      res.status(204).send(); // 204 No Content
    } else {
      res.status(404).json({ message: `Cannot delete Location with id=${id}. Maybe Location was not found!` });
    }
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Error deleting location', error: error.message });
  }
};

// Get all departments and locations
exports.getAllDepartmentsAndLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    const departments = await Department.findAll();

    res.status(200).json({ locations: locations, departments: departments });
  } catch (error) {
    console.error('Error getting all departments and locations:', error);
    res.status(500).json({ message: 'Error getting all departments and locations', error: error.message });
  }
};