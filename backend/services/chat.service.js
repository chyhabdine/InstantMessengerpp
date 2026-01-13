class ChatService {
    constructor({ conversationRepository, userRepository }) {
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    async listChats(userId) {
        const chats = await this.conversationRepository.listByUserId(userId);
        const results = [];
        for (const chat of chats) {
            const members = await this.conversationRepository.listMembers(chat.id);
            results.push({
                id: chat.id,
                name: chat.name,
                isGroup: !!chat.isGroup,
                members
            });
        }
        return results;
    }

    async createChat(userId, { name, isGroup, memberIds }) {
        const chat = await this.conversationRepository.createConversation({ name, isGroup: !!isGroup });
        await this.conversationRepository.addMember(chat.id, userId, "Owner");
        for (const memberId of memberIds) {
            const user = await this.userRepository.findById(memberId);
            if (user && memberId !== userId) {
                await this.conversationRepository.addMember(chat.id, memberId, "Member");
            }
        }
        const members = await this.conversationRepository.listMembers(chat.id);
        return {
            id: chat.id,
            name: chat.name,
            isGroup: !!chat.isGroup,
            members
        };
    }

    async addMember(userId, chatId, targetId, role) {
        const chat = await this.conversationRepository.findById(chatId);
        if (!chat) return null;
        const members = await this.conversationRepository.listMembers(chatId);
        const isMember = members.some(member => member.userId === userId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        const targetUser = await this.userRepository.findById(targetId);
        if (!targetUser) return null;
        await this.conversationRepository.addMember(chatId, targetId, role);
        return true;
    }

    async ensureMember(userId, chatId) {
        const members = await this.conversationRepository.listMembers(chatId);
        return members.some(member => member.userId === userId);
    }
}

module.exports = ChatService;
