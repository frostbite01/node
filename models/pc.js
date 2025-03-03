module.exports = (sequelize, DataTypes) => {
  const PC = sequelize.define('PC', {
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
    processor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ram_size: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    storage: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    os: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.STRING(100),
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
    tableName: 'pc',
    timestamps: true
  });

  return PC;
}; 