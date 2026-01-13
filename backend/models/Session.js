module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Session",
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
            deviceId: {
                type: DataTypes.UUID,
                allowNull: true
            },
            tokenHash: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            expiresAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            tableName: "sessions",
            timestamps: false
        }
    );
};
