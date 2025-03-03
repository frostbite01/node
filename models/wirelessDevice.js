module.exports = (sequelize, DataTypes) => {
  const WirelessDevice = sequelize.define('WirelessDevice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    serial_number: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    frequency: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    range_km: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
      defaultValue: 'active'
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    warranty_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'wireless_device',
    timestamps: true
  });

  return WirelessDevice;
}; 