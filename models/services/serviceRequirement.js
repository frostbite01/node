module.exports = (sequelize, DataTypes) => {
  const ServiceRequirement = sequelize.define('ServiceRequirement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serviceTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_types',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fieldType: {
      type: DataTypes.STRING, // 'text', 'file', 'select', etc.
      defaultValue: 'text'
    },
    options: {
      type: DataTypes.JSON, // For select fields
      allowNull: true
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
    tableName: 'service_requirements'
  });

  return ServiceRequirement;
}; 