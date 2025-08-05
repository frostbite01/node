module.exports = (sequelize, DataTypes) => {
  const WifiRequestForm = sequelize.define('WifiRequestForm', {
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
    // Request type
    pengguna_baru: {
      type: DataTypes.STRING,
      defaultValue: '' // Store "✓" or "" for checkbox
    },
    pergantian_mac: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    // Device type fields as strings to store check marks
    komputer: {
      type: DataTypes.STRING,
      defaultValue: '' // Can store "✓" for checked
    },
    laptop: {
      type: DataTypes.STRING,
      defaultValue: '' // Can store "✓" for checked
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
    // Location
    mess: DataTypes.STRING,
    diluar: DataTypes.STRING,
    alamat: DataTypes.STRING,
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
    serial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    keperluan: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hari: DataTypes.STRING,
    te: DataTypes.STRING,
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
      defaultValue: 'pending', // pending, approved, rejected
      allowNull: false
    }
  }, {
    tableName: 'wifi_request_forms',
    hooks: {
      beforeCreate: async (form) => {
        const count = await sequelize.models.WifiRequestForm.count();
        form.serial_number = `COE/ICT/F-WIFI/${String(count + 1).padStart(3, '0')}`;
      }
    }
  });

  WifiRequestForm.associate = function(models) {
    WifiRequestForm.belongsTo(models.User, {
      foreignKey: 'submitted_by',
      as: 'submitter'
    });
  };

  return WifiRequestForm;
};