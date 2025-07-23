const { Op } = require('sequelize'); // Import Op from sequelize

module.exports = (sequelize, DataTypes) => {
  const Software = sequelize.define('Software', {
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
    version: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    license_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    license_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    departmentId: { // Foreign key for Department
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'department', // Use the table name
        key: 'id'
      }
    },
    locationId: { // Foreign key for Location
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'location', // Use the table name
        key: 'id'
      }
    },
    assigned_to: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'software',
    timestamps: true,
    hooks: {
      beforeCreate: async (software, options) => {
        const assetType = 'SOF'; // Fixed asset type for Software

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

          software.asset_id = assetId;
        });
      }
    }
  });

  return Software;
};