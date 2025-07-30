module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define('Form', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '📄' // Default icon
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    requiredRole: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user'
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true
    },
    submissionRoute: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Form;
};