const { User } = require('../models');
const { Op } = require('sequelize');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Don't send passwords
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create a new user (admin function)
exports.createUser = async (req, res) => {
  try {
    const { 
      username, 
      name,      // Add name field
      email, 
      password, 
      role, 
      employeeId, 
      department, 
      position, 
      phoneNumber,
      isActive
    } = req.body;
    
    // For employees, password can be null
    if (role !== 'employee' && !password) {
      return res.status(400).json({ message: 'Password is required for web users' });
    }
    
    const newUser = await User.create({
      username,
      name,        // Add name field
      email,
      password,    // In a real app, hash this password!
      role,
      employeeId,
      department,
      position,
      phoneNumber,
      isActive: isActive !== undefined ? isActive : true
    });
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);  // Add better error logging
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'User already exists with that username, email, or employee ID' 
      });
    }
    return res.status(500).json({ 
      message: 'Server error',
      error: error.message  // Add error message to response
    });
  }
};

// Update user (admin function)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      username, 
      email, 
      role, 
      employeeId, 
      department, 
      position, 
      phoneNumber,
      isActive
    } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user fields
    await user.update({
      username,
      email,
      role,
      employeeId,
      department,
      position,
      phoneNumber,
      isActive
    });
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user.toJSON();
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete user (admin function)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user status (activate/deactivate)
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive field is required' });
    }
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({ isActive });
    
    return res.status(200).json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user.id,
        username: user.username,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get employees only
exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: 'employee' },
      attributes: { exclude: ['password'] }
    });
    
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Create an employee
exports.createEmployee = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      employeeId, 
      department, 
      position, 
      phoneNumber
    } = req.body;
    
    const newEmployee = await User.create({
      username,
      email,
      password: null, // Employees don't need passwords
      role: 'employee',
      employeeId,
      department,
      position,
      phoneNumber,
      isActive: true
    });
    
    return res.status(201).json({
      message: 'Employee created successfully',
      employee: {
        ...newEmployee.toJSON(),
        password: undefined
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Employee already exists with that username, email, or employee ID' 
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};