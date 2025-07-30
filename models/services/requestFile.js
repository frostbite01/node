// models/RequestFile.js
module.exports = (sequelize, DataTypes) => {
  const RequestFile = sequelize.define('RequestFile', {
    documentKey: DataTypes.STRING,
    filePath: DataTypes.STRING,
  });

  RequestFile.associate = models => {
    RequestFile.belongsTo(models.ServiceRequest, { foreignKey: 'requestId' });
  };

  return RequestFile;
};
