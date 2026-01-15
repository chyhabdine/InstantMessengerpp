class AttachmentRepository {
    constructor(models) {
        this.Attachment = models.Attachment;
    }

    async listByMessageId(messageId) {
        return this.Attachment.findAll({ where: { messageId } });
    }

    async listByMessageIds(messageIds) {
        return this.Attachment.findAll({ where: { messageId: messageIds } });
    }

    async findById(id) {
        return this.Attachment.findByPk(id);
    }

    async create(data) {
        return this.Attachment.create(data);
    }

    async update(id, data) {
        await this.Attachment.update(data, { where: { id } });
        return this.findById(id);
    }

    async remove(id) {
        const row = await this.findById(id);
        if (!row) return null;
        await row.destroy();
        return row;
    }
}

module.exports = AttachmentRepository;
