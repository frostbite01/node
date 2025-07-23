module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    file_path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    inventoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    inventoryType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['Switch', 'PC', 'Laptop', 'Printer', 'Peripheral', 
                'Router', 'WirelessDevice', 'CctvNvr', 'AccessPoint', 'Software']]
      }
    }
  }, {
    tableName: 'images',
    timestamps: true
  });

  return Image;
};