'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAuth = sequelize.define('UserAuth', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('company', 'seeker', 'admin'),
      allowNull: false,
    },
    related_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    tableName: 'user_auth',
    timestamps: false,
  });
  
  UserAuth.associate = function(models) {
    // 关联企业表或求职者表
    UserAuth.belongsTo(models.Company, {
      foreignKey: 'related_id',
      targetKey: 'company_id',
      constraints: false,
      as: 'Company'
    });
    
    UserAuth.belongsTo(models.Seeker, {
      foreignKey: 'related_id',
      targetKey: 'seeker_id',
      constraints: false,
      as: 'Seeker'
    });
  };
  
  return UserAuth;
};