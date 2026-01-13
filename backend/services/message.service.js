class MessageService {
    constructor({ messageRepository, conversationRepository, userRepository }) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
    }

    async listMessages(userId, chatId) {
        const members = await this.conversationRepository.listMembers(chatId);
        const isMember = members.some(member => member.userId === userId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        const messages = await this.messageRepository.listByConversationId(chatId);
        const senderIds = [...new Set(messages.map(message => message.senderId))];
        const senders = await Promise.all(senderIds.map(id => this.userRepository.findById(id)));
        return messages.map(message => {
            const sender = senders.find(u => u && u.id === message.senderId);
            message.senderName = sender ? sender.displayName || sender.userName : "";
            message.attachments = [];
            return message;
        });
    }

    async sendMessage(userId, chatId, { content, attachments }) {
        const members = await this.conversationRepository.listMembers(chatId);
        const isMember = members.some(member => member.userId === userId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        const sender = await this.userRepository.findById(userId);
        const receiverId = members.find(member => member.userId !== userId)?.userId || null;
        const message = await this.messageRepository.create({
            senderId: userId,
            receiverId,
            conversationId: chatId,
            content,
            timestamp: new Date()
        });
        return {
            id: message.id,
            chatId: chatId,
            senderId: userId,
            senderName: sender ? sender.displayName || sender.userName : "",
            content: message.content,
            sentAt: message.timestamp,
            attachments: Array.isArray(attachments) ? attachments : []
        };
    }
}

module.exports = MessageService;
