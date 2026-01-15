class MessageRepository {
    constructor(models) {
        this.Message = models.Message;
    }

    async listByConversationId(conversationId) {
        return this.Message.findAll({ where: { conversationId }, order: [["timestamp", "ASC"]] });
    }

    async findById(id) {
        return this.Message.findByPk(id);
    }

    async create(messageData) {
        return this.Message.create(messageData);
    }
}

module.exports = MessageRepository;
