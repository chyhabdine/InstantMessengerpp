module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "FriendRequest",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            requesterId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            receiverId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Pending"
            }
        },
        {
            tableName: "friend_requests",
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ["requesterId", "receiverId"]
                }
            ]
        }
    );
};
