class ReactionService {
    constructor({ reactionRepository, messageRepository, conversationRepository }) {
        this.reactionRepository = reactionRepository;
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
    }

    async ensureMember(userId, conversationId) {
        const members = await this.conversationRepository.listMembers(conversationId);
        return members.some(member => member.userId === userId);
    }

    async listByMessage(userId, messageId) {
        const message = await this.messageRepository.findById(messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        return this.reactionRepository.listByMessageId(messageId);
    }

    async upsert(userId, messageId, emoji) {
        const message = await this.messageRepository.findById(messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        const existing = await this.reactionRepository.findByMessageAndUser(messageId, userId);
        if (existing) {
            return this.reactionRepository.update(existing.id, { emoji });
        }
        return this.reactionRepository.create({
            messageId,
            userId,
            emoji
        });
    }

    async update(userId, reactionId, emoji) {
        const reaction = await this.reactionRepository.findById(reactionId);
        if (!reaction) return null;
        const message = await this.messageRepository.findById(reaction.messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        return this.reactionRepository.update(reactionId, { emoji });
    }

    async remove(userId, reactionId) {
        const reaction = await this.reactionRepository.findById(reactionId);
        if (!reaction) return null;
        const message = await this.messageRepository.findById(reaction.messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        return this.reactionRepository.remove(reactionId);
    }
}

module.exports = ReactionService;
