class ReactionRepository {
    constructor(models) {
        this.Reaction = models.Reaction;
    }

    async listByMessageId(messageId) {
        return this.Reaction.findAll({ where: { messageId } });
    }

    async findById(id) {
        return this.Reaction.findByPk(id);
    }

    async findByMessageAndUser(messageId, userId) {
        return this.Reaction.findOne({ where: { messageId, userId } });
    }

    async create(data) {
        return this.Reaction.create(data);
    }

    async update(id, data) {
        await this.Reaction.update(data, { where: { id } });
        return this.findById(id);
    }

    async remove(id) {
        const row = await this.findById(id);
        if (!row) return null;
        await row.destroy();
        return row;
    }
}

module.exports = ReactionRepository;
