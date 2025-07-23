module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'location',
    timestamps: true // Keep timestamps for createdAt and updatedAt
  });

  return Location;
};