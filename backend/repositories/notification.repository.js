class NotificationRepository {
    constructor(models) {
        this.Notification = models.Notification;
    }

    async listByUserId(userId) {
        return this.Notification.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]]
        });
    }

    async findById(id) {
        return this.Notification.findByPk(id);
    }

    async create(data) {
        return this.Notification.create(data);
    }

    async update(id, data) {
        await this.Notification.update(data, { where: { id } });
        return this.findById(id);
    }

    async remove(id) {
        const row = await this.findById(id);
        if (!row) return null;
        await row.destroy();
        return row;
    }
}

module.exports = NotificationRepository;
