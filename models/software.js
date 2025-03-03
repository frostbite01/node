module.exports = (sequelize, DataTypes) => {
  const Software = sequelize.define('Software', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    license_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assigned_to: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('active', 'expired', 'renewal_due'),
      defaultValue: 'active'
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'software',
    timestamps: true
  });

  return Software;
}; 