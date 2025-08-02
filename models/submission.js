module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('Submission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Submission.associate = (models) => {
    Submission.belongsTo(models.Form, {
      foreignKey: 'form_id',
      onDelete: 'CASCADE'
    });
    Submission.hasMany(models.SubmissionData, {
      foreignKey: 'submission_id',
      onDelete: 'CASCADE'
    });
  };

  return Submission;
};