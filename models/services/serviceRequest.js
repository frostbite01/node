// models/ServiceRequest.js
module.exports = (sequelize, DataTypes) => {
  const ServiceRequest = sequelize.define('ServiceRequest', {
    formData: DataTypes.JSON,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  });

  ServiceRequest.associate = models => {
    ServiceRequest.belongsTo(models.User, { foreignKey: 'userId' });
    ServiceRequest.belongsTo(models.Service, { foreignKey: 'serviceId' });
    ServiceRequest.hasMany(models.RequestFile, { foreignKey: 'requestId' });
  };

  return ServiceRequest;
};
