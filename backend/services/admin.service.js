const crypto = require("crypto");

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
}

function buildUserPayload(payload, isCreate) {
    const data = { ...payload };
    if (payload.password) {
        const salt = crypto.randomBytes(16).toString("hex");
        data.passwordSalt = salt;
        data.passwordHash = hashPassword(payload.password, salt);
        delete data.password;
    }

    if (isCreate && (!data.passwordHash || !data.passwordSalt)) {
        throw new Error("User password is required.");
    }

    return data;
}

function normalizeNotificationPayload(payload) {
    const data = { ...payload };
    if (typeof data.payload !== "string") {
        data.payload = JSON.stringify(data.payload || {});
    }
    return data;
}

function normalizeAttachmentPayload(payload) {
    const data = { ...payload };
    if (typeof data.size !== "number") {
        data.size = Number(data.size || 0);
    }
    return data;
}

function normalizeMessagePayload(payload) {
    const data = { ...payload };
    if (!data.timestamp) {
        data.timestamp = new Date();
    }
    return data;
}

function normalizeSessionPayload(payload) {
    const data = { ...payload };
    if (!data.tokenHash) {
        data.tokenHash = crypto.randomBytes(32).toString("hex");
    }
    if (!data.createdAt) {
        data.createdAt = new Date();
    }
    return data;
}

class AdminService {
    constructor(models) {
        this.models = models;
        this.entityMap = {
            users: models.User,
            roles: models.Role,
            profiles: models.UserProfile,
            sessions: models.Session,
            devices: models.Device,
            conversations: models.Conversation,
            chat_members: models.ChatMember,
            messages: models.Message,
            attachments: models.Attachment,
            reactions: models.Reaction,
            friend_requests: models.FriendRequest,
            notifications: models.Notification
        };
    }

    getModel(entity) {
        return this.entityMap[entity];
    }

    preprocess(entity, payload, isCreate) {
        if (entity === "users") {
            return buildUserPayload(payload, isCreate);
        }
        if (entity === "notifications") {
            return normalizeNotificationPayload(payload);
        }
        if (entity === "attachments") {
            return normalizeAttachmentPayload(payload);
        }
        if (entity === "messages") {
            return normalizeMessagePayload(payload);
        }
        if (entity === "sessions") {
            return normalizeSessionPayload(payload);
        }
        return payload;
    }

    async list(entity) {
        const model = this.getModel(entity);
        if (!model) return null;
        return model.findAll();
    }

    async get(entity, id) {
        const model = this.getModel(entity);
        if (!model) return null;
        return model.findByPk(id);
    }

    async create(entity, payload) {
        const model = this.getModel(entity);
        if (!model) return null;
        const data = this.preprocess(entity, payload, true);
        return model.create(data);
    }

    async update(entity, id, payload) {
        const model = this.getModel(entity);
        if (!model) return null;
        const data = this.preprocess(entity, payload, false);
        await model.update(data, { where: { id } });
        return model.findByPk(id);
    }

    async remove(entity, id) {
        const model = this.getModel(entity);
        if (!model) return null;
        const row = await model.findByPk(id);
        if (!row) return null;
        await row.destroy();
        return row;
    }
}

module.exports = AdminService;
