module.exports = (sequelize, DataTypes) => {
  const Seeker = sequelize.define('Seeker', {
    seeker_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('男', '女', '其他'),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    hometown: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    highest_degree: {
      type: DataTypes.ENUM('高中', '专科', '本科', '硕士', '博士'),
      allowNull: false,
    },
    major: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    degree: {
      type: DataTypes.ENUM('学士', '硕士', '博士', '其他'),
      allowNull: true,
    },
    school: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'job_seeker',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  });

  Seeker.associate = models => {
    Seeker.hasMany(models.Resume, { foreignKey: 'seeker_id', as: 'Resumes' });
  };

  return Seeker;
};