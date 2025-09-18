module.exports = (sequelize, DataTypes) => {
  const CCTVRequestForm = sequelize.define('CCTVRequestForm', {
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
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false
    },
    keperluan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    disetujui: {
      type: DataTypes.STRING,
      allowNull: false
    },
    diketahui: DataTypes.STRING,
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
    tableName: 'cctv_request_forms',
    hooks: {
      beforeCreate: async (form) => {
        const count = await sequelize.models.CCTVRequestForm.count();
        const month = 'IX'; // You might want to make this dynamic
        const year = '2025'; // You might want to make this dynamic
        form.serial_number = `${String(count + 1).padStart(3, '0')}/A-CCTV/ICT-COE/${month}/${year}`;
      }
    }
  });

  CCTVRequestForm.associate = function(models) {
    CCTVRequestForm.belongsTo(models.User, {
      foreignKey: 'submitted_by',
      as: 'submitter'
    });
  };

  return CCTVRequestForm;
};