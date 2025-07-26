'use strict';
module.exports = (sequelize, DataTypes) => {
  const SuperAdmin = sequelize.define('SuperAdmin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  }, {
    tableName: 'super_admin',
    timestamps: false,
  });
  
  return SuperAdmin;
}; 