module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "UserProfile",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: true
            },
            displayName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            statusMessage: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            },
            presence: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Online"
            },
            avatarUrl: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: ""
            }
        },
        {
            tableName: "user_profiles",
            timestamps: false
        }
    );
};
