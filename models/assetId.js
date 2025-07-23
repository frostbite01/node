// filepath: /Users/bayusatrio/server/models/assetId.js
module.exports = (sequelize, DataTypes) => {
  const AssetId = sequelize.define('AssetId', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asset_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true // Ensure each asset type has only one record
    },
    next_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    tableName: 'asset_ids',
    timestamps: false // Disable timestamps
  });

  return AssetId;
};