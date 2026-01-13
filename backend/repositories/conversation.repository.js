class ConversationRepository {
    constructor(models) {
        this.Conversation = models.Conversation;
        this.ChatMember = models.ChatMember;
        this.User = models.User;
    }

    async listByUserId(userId) {
        const memberRows = await this.ChatMember.findAll({ where: { userId } });
        const ids = memberRows.map(row => row.conversationId);
        if (ids.length === 0) return [];
        return this.Conversation.findAll({ where: { id: ids } });
    }

    async findById(id) {
        return this.Conversation.findByPk(id);
    }

    async createConversation({ name, isGroup }) {
        return this.Conversation.create({ name, isGroup });
    }

    async addMember(conversationId, userId, role) {
        const existing = await this.ChatMember.findOne({ where: { conversationId, userId } });
        if (existing) return existing;
        return this.ChatMember.create({
            conversationId,
            userId,
            role: role || "Member"
        });
    }

    async listMembers(conversationId) {
        const members = await this.ChatMember.findAll({ where: { conversationId } });
        if (members.length === 0) return [];
        const users = await this.User.findAll({ where: { id: members.map(m => m.userId) } });
        return members.map(member => {
            const user = users.find(u => u.id === member.userId);
            return {
                userId: member.userId,
                userName: user ? user.userName : "",
                displayName: user ? user.displayName : "",
                role: member.role
            };
        });
    }
}

module.exports = ConversationRepository;
