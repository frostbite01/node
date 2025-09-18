module.exports = (sequelize, DataTypes) => {
  const SoftwareRequestForm = sequelize.define('SoftwareRequestForm', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    serial_number: {
      type: DataTypes.STRING,
      unique: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    // Device type
    komputer: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    laptop: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    handphone: {
      type: DataTypes.STRING,
      defaultValue: '' // Can store "✓" for checked
    },
    // User info
    nomor: DataTypes.STRING,
    nama: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nrp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jabatan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Software details
    software_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    version: DataTypes.STRING,
    keperluan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    disetujui: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Device details
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mac: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sn: {
      type: DataTypes.STRING,
      allowNull: false
    },
    submitted_by: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      allowNull: false
    }
  }, {
    tableName: 'software_request_forms',
    hooks: {
      beforeCreate: async (form) => {
        const count = await sequelize.models.SoftwareRequestForm.count();
        const month = 'IX'; // You might want to make this dynamic
        const year = '2025'; // You might want to make this dynamic
        form.serial_number = `${String(count + 1).padStart(3, '0')}/A-APPS/ICT-COE/${month}/${year}`;
      }
    }
  });

  SoftwareRequestForm.associate = function(models) {
    SoftwareRequestForm.belongsTo(models.User, {
      foreignKey: 'submitted_by',
      as: 'submitter'
    });
  };

  return SoftwareRequestForm;
};