module.exports = (sequelize, DataTypes) => {
  const Peripheral = sequelize.define('Peripheral', {
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
    type: {
      type: DataTypes.ENUM('keyboard', 'mouse', 'monitor', 'headset', 'speaker', 'other'),
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
    tableName: 'peripheral',
    timestamps: true
  });

  return Peripheral;
}; 