module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Device",
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
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastSeenAt: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            tableName: "devices",
            timestamps: false
        }
    );
};
