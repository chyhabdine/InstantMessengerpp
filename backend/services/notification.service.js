class NotificationService {
    constructor({ notificationRepository, userRepository }) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    async list(userId) {
        return this.notificationRepository.listByUserId(userId);
    }

    async create(userId, payload) {
        const user = await this.userRepository.findById(userId);
        if (!user) return null;
        const normalizedPayload = typeof payload.payload === "string"
            ? payload.payload
            : JSON.stringify(payload.payload || {});
        return this.notificationRepository.create({
            userId,
            type: payload.type,
            payload: normalizedPayload,
            isRead: !!payload.isRead
        });
    }

    async update(userId, notificationId, payload) {
        const notification = await this.notificationRepository.findById(notificationId);
        if (!notification) return null;
        if (notification.userId !== userId) {
            const error = new Error("FORBIDDEN");
            error.code = "FORBIDDEN";
            throw error;
        }
        const data = {
            type: payload.type || notification.type,
            payload: typeof payload.payload === "string"
                ? payload.payload
                : JSON.stringify(payload.payload || JSON.parse(notification.payload || "{}")),
            isRead: typeof payload.isRead === "boolean" ? payload.isRead : notification.isRead
        };
        return this.notificationRepository.update(notificationId, data);
    }

    async remove(userId, notificationId) {
        const notification = await this.notificationRepository.findById(notificationId);
        if (!notification) return null;
        if (notification.userId !== userId) {
            const error = new Error("FORBIDDEN");
            error.code = "FORBIDDEN";
            throw error;
        }
        return this.notificationRepository.remove(notificationId);
    }
}

module.exports = NotificationService;
