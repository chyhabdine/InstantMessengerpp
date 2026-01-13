const { DataTypes } = require("sequelize");

const initUser = require("./User");
const initRole = require("./Role");
const initUserProfile = require("./UserProfile");
const initConversation = require("./Conversation");
const initChatMember = require("./ChatMember");
const initMessage = require("./Message");
const initAttachment = require("./Attachment");
const initReaction = require("./Reaction");
const initFriendRequest = require("./FriendRequest");
const initNotification = require("./Notification");
const initSession = require("./Session");
const initDevice = require("./Device");

module.exports = (sequelize) => {
    const models = {};

    models.User = initUser(sequelize, DataTypes);
    models.Role = initRole(sequelize, DataTypes);
    models.UserProfile = initUserProfile(sequelize, DataTypes);
    models.Conversation = initConversation(sequelize, DataTypes);
    models.ChatMember = initChatMember(sequelize, DataTypes);
    models.Message = initMessage(sequelize, DataTypes);
    models.Attachment = initAttachment(sequelize, DataTypes);
    models.Reaction = initReaction(sequelize, DataTypes);
    models.FriendRequest = initFriendRequest(sequelize, DataTypes);
    models.Notification = initNotification(sequelize, DataTypes);
    models.Session = initSession(sequelize, DataTypes);
    models.Device = initDevice(sequelize, DataTypes);

    models.Role.hasMany(models.User, { foreignKey: "roleId" });
    models.User.belongsTo(models.Role, { foreignKey: "roleId" });

    models.User.hasOne(models.UserProfile, { foreignKey: "userId" });
    models.UserProfile.belongsTo(models.User, { foreignKey: "userId" });

    models.User.hasMany(models.Session, { foreignKey: "userId" });
    models.Session.belongsTo(models.User, { foreignKey: "userId" });

    models.User.hasMany(models.Device, { foreignKey: "userId" });
    models.Device.belongsTo(models.User, { foreignKey: "userId" });

    models.Conversation.hasMany(models.ChatMember, { foreignKey: "conversationId" });
    models.ChatMember.belongsTo(models.Conversation, { foreignKey: "conversationId" });
    models.User.hasMany(models.ChatMember, { foreignKey: "userId" });
    models.ChatMember.belongsTo(models.User, { foreignKey: "userId" });

    models.Conversation.hasMany(models.Message, { foreignKey: "conversationId" });
    models.Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });
    models.User.hasMany(models.Message, { foreignKey: "senderId" });
    models.Message.belongsTo(models.User, { foreignKey: "senderId", as: "sender" });

    models.Message.hasMany(models.Attachment, { foreignKey: "messageId" });
    models.Attachment.belongsTo(models.Message, { foreignKey: "messageId" });

    models.Message.hasMany(models.Reaction, { foreignKey: "messageId" });
    models.Reaction.belongsTo(models.Message, { foreignKey: "messageId" });
    models.User.hasMany(models.Reaction, { foreignKey: "userId" });
    models.Reaction.belongsTo(models.User, { foreignKey: "userId" });

    models.User.hasMany(models.FriendRequest, { foreignKey: "requesterId", as: "sentRequests" });
    models.User.hasMany(models.FriendRequest, { foreignKey: "receiverId", as: "receivedRequests" });

    models.User.hasMany(models.Notification, { foreignKey: "userId" });
    models.Notification.belongsTo(models.User, { foreignKey: "userId" });

    return models;
};
