const { Op } = require('sequelize'); // Import Op from sequelize
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'backlog', 'done', 'canceled'), // lowercase and underscore
       defaultValue: 'todo'
    },
    priority: {
      type: DataTypes.ENUM('Low', 'Medium', 'High'),
      defaultValue: 'Medium'
    },
    dueDate: {
      type: DataTypes.DATE
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  });

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'assignedTo',
      as: 'assignee'
    });
    Task.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
  };

  return Task;
}; 
