module.exports = (sequelize, DataTypes) => {
  const Resume = sequelize.define('Resume', {
    resume_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seeker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    upload_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'resume',
    timestamps: false,
  });

  Resume.associate = models => {
    Resume.belongsTo(models.Seeker, { foreignKey: 'seeker_id', as: 'Seeker' });
    Resume.belongsTo(models.Job, { foreignKey: 'job_id', as: 'Job' });
  };

  return Resume;
}; 