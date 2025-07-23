const { Image } = require('../models');
const { Op } = require('sequelize');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Required fields check
    if (!req.body.inventoryId || !req.body.inventoryType) {
      return res.status(400).json({ 
        message: 'inventoryId and inventoryType are required' 
      });
    }

    const image = await Image.create({
      file_path: req.file.path,
      file_name: req.file.filename,
      inventoryId: req.body.inventoryId,
      inventoryType: req.body.inventoryType
    });

    res.status(201).json(image);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Error fetching image' });
  }
};

exports.getAllImages = async (req, res) => {
  try {
    // Only get images associated with an inventory item
    const images = await Image.findAll({
      where: {
        inventoryId: {
          [Op.not]: null
        },
        inventoryType: {
          [Op.not]: null
        }
      }
    });
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
};