const { Op } = require('sequelize'); // Import Op from sequelize
module.exports = (sequelize, DataTypes) => {
  const WirelessDevice = sequelize.define('WirelessDevice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asset_id: {
      type: DataTypes.STRING(10),
      allowNull: true
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
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    locationId: { // Foreign key for Location
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'location', // Use the table name
        key: 'id'
      }
    },
    departmentId: { // Foreign key for Department
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'department', // Use the table name
        key: 'id'
      }
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
    timestamps: true,
    hooks: {
      beforeCreate: async (wirelessDevice, options) => {
        const assetType = 'WD'; // Fixed asset type for Wireless Devices

        // Use a transaction to ensure atomicity
        await sequelize.transaction(async (t) => {
          const [assetIdRecord, created] = await sequelize.models.AssetId.findOrCreate({
            where: { asset_type: assetType },
            defaults: { next_id: 1 },
            transaction: t
          });

          const nextId = assetIdRecord.next_id;
          const assetId = `${assetType}${String(nextId).padStart(4, '0')}`;

          // Increment the next_id value
          await assetIdRecord.update({ next_id: nextId + 1 }, { transaction: t });

          wirelessDevice.asset_id = assetId;
        });
      }
    }
  });

  return WirelessDevice;
};