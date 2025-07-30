module.exports = (sequelize, DataTypes) => {
  const ServiceRequestFile = sequelize.define('ServiceRequestFile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serviceRequestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'service_requests',
        key: 'id'
      }
    },
    requirementId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'service_requirements',
        key: 'id'
      }
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mimeType: {
      type: DataTypes.STRING,
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
    tableName: 'service_request_files'
  });

  return ServiceRequestFile;
}; 