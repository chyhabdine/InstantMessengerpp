module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Reaction",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            messageId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            userId: {
                type: DataTypes.UUID,
                allowNull: false
            },
            emoji: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            tableName: "reactions",
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["messageId", "userId"]
                }
            ]
        }
    );
};
