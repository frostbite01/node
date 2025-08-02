module.exports = (sequelize, DataTypes) => {
  const Form = sequelize.define('Form', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    code_prefix: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Ensure unique prefix per form
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_serial: {
      type: DataTypes.INTEGER,
      defaultValue: 0 // Track last used number for this form
    },
    serial_placeholder_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Allow null initially, will be set after creating placeholder
    }
  });

  Form.associate = (models) => {
    Form.hasMany(models.Placeholder, {
      foreignKey: 'form_id',
      onDelete: 'CASCADE'
    });
    Form.hasMany(models.Submission, {
      foreignKey: 'form_id',
      onDelete: 'CASCADE'
    });
  };

  // Method to generate and increment serial number
  Form.prototype.generateSerialNumber = async function(t) {
    const nextNumber = this.last_serial + 1;
    
    // Update the last_serial in database
    await this.update(
      { last_serial: nextNumber },
      { transaction: t }
    );

    // Return formatted serial number
    return `${this.code_prefix}/${String(nextNumber).padStart(3, '0')}`;
  };

  return Form;
};