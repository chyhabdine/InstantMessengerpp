function listChats(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const chats = await ctx.services.chats.listChats(user.id);
        return ctx.json(res, 200, chats);
    };
}

function createChat(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const body = req.body || {};
        const name = (body.name || "").trim();
        if (!name) {
            return ctx.badRequest(res, "Chat name is required.");
        }
        const memberIds = Array.isArray(body.memberIds) ? body.memberIds : [];
        const chat = await ctx.services.chats.createChat(user.id, {
            name,
            isGroup: !!body.isGroup,
            memberIds
        });
        return ctx.json(res, 200, chat);
    };
}

function addMember(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const chatId = req.params.id;
        const body = req.body || {};
        const targetId = (body.userId || "").trim();
        const role = (body.role || "Member").trim() || "Member";
        if (!targetId) {
            return ctx.badRequest(res, "User id is required.");
        }
        try {
            const added = await ctx.services.chats.addMember(user.id, chatId, targetId, role);
            if (!added) {
                return ctx.notFound(res, "Chat or user not found.");
            }
            return ctx.noContent(res);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to add member.");
        }
    };
}

function listMessages(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const chatId = req.params.id;
        try {
            const messages = await ctx.services.messages.listMessages(user.id, chatId);
            const result = messages.map(message => ({
                id: message.id,
                chatId: message.conversationId,
                senderId: message.senderId,
                senderName: message.senderName || "",
                content: message.content,
                sentAt: message.timestamp,
                attachments: message.attachments || []
            }));
            return ctx.json(res, 200, result);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.notFound(res, "Chat not found.");
        }
    };
}

function sendMessage(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const chatId = req.params.id;
        const body = req.body || {};
        const content = (body.content || "").trim();
        if (!content) {
            return ctx.badRequest(res, "Message content is required.");
        }
        try {
            const message = await ctx.services.messages.sendMessage(user.id, chatId, {
                content,
                attachments: body.attachments || []
            });
            return ctx.json(res, 200, message);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.notFound(res, "Chat not found.");
        }
    };
}

module.exports = {
    listChats,
    createChat,
    addMember,
    listMessages,
    sendMessage
};
