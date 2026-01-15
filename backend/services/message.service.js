class MessageService {
    constructor({ messageRepository, conversationRepository, userRepository, attachmentRepository, notificationRepository }) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.userRepository = userRepository;
        this.attachmentRepository = attachmentRepository;
        this.notificationRepository = notificationRepository;
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
        const messageIds = messages.map(message => message.id);
        const attachments = messageIds.length > 0
            ? await this.attachmentRepository.listByMessageIds(messageIds)
            : [];
        return messages.map(message => {
            const sender = senders.find(u => u && u.id === message.senderId);
            message.senderName = sender ? sender.displayName || sender.userName : "";
            message.attachments = attachments.filter(att => att.messageId === message.id);
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
        const savedAttachments = [];
        if (Array.isArray(attachments)) {
            for (const attachment of attachments) {
                if (!attachment || !attachment.url) continue;
                const saved = await this.attachmentRepository.create({
                    messageId: message.id,
                    url: attachment.url,
                    fileName: attachment.fileName || "attachment",
                    mimeType: attachment.mimeType || "application/octet-stream",
                    size: Number(attachment.size || 0)
                });
                savedAttachments.push(saved);
            }
        }
        if (receiverId) {
            await this.notificationRepository.create({
                userId: receiverId,
                type: "Message",
                payload: JSON.stringify({ messageId: message.id, chatId }),
                isRead: false
            });
        }
        return {
            id: message.id,
            chatId: chatId,
            senderId: userId,
            senderName: sender ? sender.displayName || sender.userName : "",
            content: message.content,
            sentAt: message.timestamp,
            attachments: savedAttachments
        };
    }
}

module.exports = MessageService;
