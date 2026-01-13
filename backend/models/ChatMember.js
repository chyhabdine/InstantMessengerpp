module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "ChatMember",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            conversationId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Member"
            }
        },
        {
            tableName: "chat_members",
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["conversationId", "userId"]
                }
            ]
        }
    );
};
