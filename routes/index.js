const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const authRoutes = require('./authRoutes');

// Use route modules
router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/auth', authRoutes);

// Add more routes as needed
// router.use('/posts', postRoutes);

module.exports = router; 