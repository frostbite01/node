module.exports = (sequelize, DataTypes) => {
  const Printer = sequelize.define('Printer', {
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
    toner_model: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    paper_size_supported: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    network_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
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
    tableName: 'printer',
    timestamps: true
  });

  return Printer;
}; 