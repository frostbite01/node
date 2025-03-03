module.exports = (sequelize, DataTypes) => {
  const CctvNvr = sequelize.define('CctvNvr', {
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
    storage_capacity: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    channel_count: {
      type: DataTypes.INTEGER,
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
    tableName: 'cctv_nvr',
    timestamps: true
  });

  return CctvNvr;
}; 