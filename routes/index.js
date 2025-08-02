const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./userRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');
const locationRoutes = require('./locationRoutes');
const departmentRoutes = require('./departmentRoutes');
const commonRoutes = require('./commonRoutes');
const documentRoutes = require('./documentRoutes'); // lowercase 'd'
const formRoutes = require('./formRoutes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/tasks', taskRoutes);
router.use('/locations', locationRoutes);
router.use('/departments', departmentRoutes);
router.use('/common', commonRoutes);
router.use('/documents', documentRoutes);
router.use('/forms', formRoutes);

module.exports = router;