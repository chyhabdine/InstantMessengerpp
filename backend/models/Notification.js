module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Notification",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            payload: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            isRead: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            tableName: "notifications",
            timestamps: true
        }
    );
};
