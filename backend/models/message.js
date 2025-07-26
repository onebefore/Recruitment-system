'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '发送者用户ID',
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '接收者用户ID',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: '0未读，1已读',
    },
  }, {
    tableName: 'message',
    timestamps: true,
    createdAt: 'sent_at',
    updatedAt: false,
  });

  Message.associate = function(models) {
    // Define associations for messages relating to UserAuth directly
    Message.belongsTo(models.UserAuth, { foreignKey: 'sender_id', as: 'Sender' });
    Message.belongsTo(models.UserAuth, { foreignKey: 'receiver_id', as: 'Receiver' });
  };

  return Message;
}; 