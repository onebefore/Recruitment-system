module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('Job', {
    job_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    requirements: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hire_count: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      defaultValue: 1,
    },
    publish_time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    other_requirements: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('招聘中', '已结束'),
      allowNull: true,
      defaultValue: '招聘中',
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review_status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      comment: '职位审核状态：pending待审核，approved已通过，rejected已驳回'
    },
    reject_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: '岗位审核驳回原因'
    }
  }, {
    tableName: 'job_position',
    timestamps: false,
  });

  Job.associate = models => {
    Job.belongsTo(models.Company, { foreignKey: 'company_id', as: 'Company' });
    Job.hasMany(models.Resume, { foreignKey: 'job_id', as: 'Resumes' });
  };

  return Job;
};