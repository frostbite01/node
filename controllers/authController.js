const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Op } = require('sequelize');

// Register user
exports.register = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ username }, { email }] 
      } 
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const newUser = await User.create({
      name,
      username,
      email,
      password, // In production, hash this password!
      role: role || 'user', // Default to 'user' if not specified
      isActive: true
    });
    
    // Create JWT payload
    const payload = {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    };
    
    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is an employee (employees can't login)
    if (user.role === 'employee') {
      return res.status(403).json({ message: 'Employees cannot login to the system' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    // For simplicity in this example, we're comparing plain text passwords
    // In a real application, you should use bcrypt.compare()
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    const user = req.user;
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user.toJSON();
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile (self)
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { email, phoneNumber } = req.body;
    
    // Only allow updating certain fields for self
    await user.update({
      email,
      phoneNumber
    });
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user.toJSON();
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Placeholder for other auth methods
exports.logout = (req, res) => {
  // JWT is stateless, so logout is handled client-side
  // by removing the token
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.forgotPassword = (req, res) => {
  // Implementation would send reset email
  res.status(200).json({ message: 'Password reset email sent' });
};

exports.resetPassword = (req, res) => {
  // Implementation would verify token and reset password
  res.status(200).json({ message: 'Password reset successfully' });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    
    // Verify current password
    const isMatch = currentPassword === user.password;
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    await user.update({ password: newPassword });
    
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};