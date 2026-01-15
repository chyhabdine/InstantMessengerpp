class AttachmentService {
    constructor({ attachmentRepository, messageRepository, conversationRepository }) {
        this.attachmentRepository = attachmentRepository;
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
        return this.attachmentRepository.listByMessageId(messageId);
    }

    async create(userId, messageId, payload) {
        const message = await this.messageRepository.findById(messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        return this.attachmentRepository.create({
            messageId,
            url: payload.url,
            fileName: payload.fileName,
            mimeType: payload.mimeType,
            size: Number(payload.size || 0)
        });
    }

    async update(userId, attachmentId, payload) {
        const attachment = await this.attachmentRepository.findById(attachmentId);
        if (!attachment) return null;
        const message = await this.messageRepository.findById(attachment.messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        return this.attachmentRepository.update(attachmentId, {
            url: payload.url || attachment.url,
            fileName: payload.fileName || attachment.fileName,
            mimeType: payload.mimeType || attachment.mimeType,
            size: Number(payload.size || attachment.size)
        });
    }

    async remove(userId, attachmentId) {
        const attachment = await this.attachmentRepository.findById(attachmentId);
        if (!attachment) return null;
        const message = await this.messageRepository.findById(attachment.messageId);
        if (!message) return null;
        const isMember = await this.ensureMember(userId, message.conversationId);
        if (!isMember) {
            const error = new Error("NOT_A_MEMBER");
            error.code = "NOT_A_MEMBER";
            throw error;
        }
        return this.attachmentRepository.remove(attachmentId);
    }
}

module.exports = AttachmentService;
