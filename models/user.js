module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      // Allow null for employees who don't need to log in
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'employee'),
      defaultValue: 'user',
      allowNull: false
    },
    // Employee specific fields
    employeeId: {
      type: DataTypes.STRING,
      unique: true,
      // Can be null for regular web users who aren't employees
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Status field to track if user is active
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users'
  });

  // Define associations here
  User.associate = function(models) {
    // For example: User.hasMany(models.Asset)
  };

  return User;
};