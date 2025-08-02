module.exports = (sequelize, DataTypes) => {
  const SubmissionData = sequelize.define('SubmissionData', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    submission_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placeholder_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  SubmissionData.associate = (models) => {
    SubmissionData.belongsTo(models.Submission, {
      foreignKey: 'submission_id',
      onDelete: 'CASCADE'
    });
    SubmissionData.belongsTo(models.Placeholder, {
      foreignKey: 'placeholder_id',
      onDelete: 'CASCADE'
    });
  };

  return SubmissionData;
};