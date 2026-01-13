module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Attachment",
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
            url: {
                type: DataTypes.STRING,
                allowNull: false
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mimeType: {
                type: DataTypes.STRING,
                allowNull: false
            },
            size: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "attachments",
            timestamps: false
        }
    );
};
