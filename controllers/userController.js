const { User } = require('../models');

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

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { 
      username, 
      email, 
      password, 
      role, 
      employeeId, 
      department, 
      position, 
      phoneNumber
    } = req.body;
    
    // For employees, password can be null
    if (role !== 'employee' && !password) {
      return res.status(400).json({ message: 'Password is required for web users' });
    }
    
    const newUser = await User.create({
      username,
      email,
      password, // In a real app, hash this password!
      role,
      employeeId,
      department,
      position,
      phoneNumber
    });
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'User already exists with that username, email, or employee ID' 
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user
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
    
    return res.status(200).json({ 
      message: 'User updated successfully',
      user: {
        ...user.toJSON(),
        password: undefined
      }
    });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'That username, email, or employee ID is already in use' 
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
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

// Get all employees
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