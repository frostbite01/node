module.exports = (sequelize, DataTypes) => {
  const Placeholder = sequelize.define('Placeholder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    key_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    order_index: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Placeholder.associate = (models) => {
    Placeholder.belongsTo(models.Form, {
      foreignKey: 'form_id',
      onDelete: 'CASCADE'
    });
  };

  return Placeholder;
};