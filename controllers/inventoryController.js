const db = require('../models');  // Add this line at the top

// Generic controller for all inventory items
const createInventoryController = (Model, modelName) => {
  return {
    // Get all items with their images
    getAll: async (req, res) => {
      try {
        const items = await Model.findAll({
          include: [
            { model: db.Location, as: 'locationInfo' },
            { model: db.Department, as: 'departmentInfo' },
            { 
              model: db.Image, 
              as: 'images',
              where: {
                inventoryType: modelName
              },
              required: false
            }
          ]
        });
        return res.status(200).json(items);
      } catch (error) {
        console.error(`Error fetching ${modelName}:`, error);
        return res.status(500).json({ message: `Server error while fetching ${modelName}` });
      }
    },

    // Get item by ID with its images
    getById: async (req, res) => {
      try {
        const item = await Model.findByPk(req.params.id, {
          include: [
            { model: db.Location, as: 'locationInfo' },
            { model: db.Department, as: 'departmentInfo' },
            { 
              model: db.Image, 
              as: 'images',
              where: {
                inventoryType: modelName
              },
              required: false
            }
          ]
        });

        if (!item) {
          return res.status(404).json({ message: `${modelName} not found` });
        }

        return res.status(200).json(item);
      } catch (error) {
        console.error(`Error fetching ${modelName}:`, error);
        return res.status(500).json({ message: `Server error while fetching ${modelName}` });
      }
    },

    // Create a new item
    create: async (req, res) => {
      try {
        const newItem = await Model.create(req.body);
        return res.status(201).json(newItem);
      } catch (error) {
        console.error(`Error creating ${modelName}:`, error);
        return res.status(500).json({ message: `Server error while creating ${modelName}` });
      }
    },

    // Update item
    update: async (req, res) => {
      try {
        const { id } = req.params;
        
        const item = await Model.findByPk(id);
        
        if (!item) {
          return res.status(404).json({ message: `${modelName} not found` });
        }
        
        await item.update(req.body);
        
        return res.status(200).json({ 
          message: `${modelName} updated successfully`,
          item
        });
      } catch (error) {
        console.error(`Error updating ${modelName}:`, error);
        return res.status(500).json({ message: `Server error while updating ${modelName}` });
      }
    },

    // Delete item
    delete: async (req, res) => {
      try {
        const { id } = req.params;
        
        const item = await Model.findByPk(id);
        
        if (!item) {
          return res.status(404).json({ message: `${modelName} not found` });
        }
        
        await item.destroy();
        
        return res.status(200).json({ message: `${modelName} deleted successfully` });
      } catch (error) {
        console.error(`Error deleting ${modelName}:`, error);
        return res.status(500).json({ message: `Server error while deleting ${modelName}` });
      }
    },

    // Get items by status
    getByStatus: async (req, res) => {
      try {
        const { status } = req.params;
        
        const items = await Model.findAll({
          where: { status }
        });
        
        return res.status(200).json(items);
      } catch (error) {
        console.error(`Error fetching ${modelName} by status:`, error);
        return res.status(500).json({ message: `Server error while fetching ${modelName} by status` });
      }
    },

    // Get items by assigned user
    getByAssignedUser: async (req, res) => {
      try {
        const { username } = req.params;
        
        const items = await Model.findAll({
          where: { assigned_to: username }
        });
        
        return res.status(200).json(items);
      } catch (error) {
        console.error(`Error fetching ${modelName} by assigned user:`, error);
        return res.status(500).json({ message: `Server error while fetching ${modelName} by assigned user` });
      }
    }
  };
};

module.exports = createInventoryController;