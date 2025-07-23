module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'department',
    timestamps: true // Keep timestamps for createdAt and updatedAt
  });

  return Department;
};