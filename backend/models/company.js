module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    company_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    logo_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    introduction: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    industry: {
      type: DataTypes.ENUM('互联网', '制造', '金融', '教育', '医疗', '其他'),
      allowNull: false,
    },
  }, {
    tableName: 'company_info',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Company.associate = models => {
    Company.hasMany(models.Job, {
      foreignKey: 'company_id',
      as: 'jobs',
    });
  };

  return Company;
};