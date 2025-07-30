// models/Service.js
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    templatePath: DataTypes.STRING,
    requiredFields: DataTypes.JSON,
    requiredDocs: DataTypes.JSON,
    iconUrl: DataTypes.STRING,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Service.associate = models => {
    Service.hasMany(models.ServiceRequest, { foreignKey: 'serviceId' });
  };

  return Service;
};
