const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

function listChats(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const chats = ctx.data.conversations
            .filter(c => c.participants.includes(user.id))
            .map(chat => ({
                id: chat.id,
                name: chat.name,
                isGroup: !!chat.isGroup,
                members: chat.members.map(member => {
                    const memberUser = ctx.data.users.find(u => u.id === member.userId);
                    return {
                        userId: member.userId,
                        userName: memberUser ? memberUser.userName : "",
                        displayName: memberUser ? memberUser.displayName : "",
                        role: member.role
                    };
                })
            }));
        return ctx.json(res, 200, chats);
    };
}

function createChat(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const body = req.body || {};
        const name = (body.name || "").trim();
        if (!name) {
            return ctx.badRequest(res, "Chat name is required.");
        }

        const memberIds = Array.isArray(body.memberIds) ? body.memberIds : [];
        const uniqueMembers = [{ userId: user.id, role: "Owner" }];
        memberIds.forEach(id => {
            if (!uniqueMembers.some(m => m.userId === id)) {
                const found = ctx.data.users.find(u => u.id === id);
                if (found) {
                    uniqueMembers.push({ userId: id, role: "Member" });
                }
            }
        });

        const conversation = new Conversation({
            id: ctx.newId(),
            name,
            isGroup: !!body.isGroup,
            participants: uniqueMembers.map(m => m.userId),
            members: uniqueMembers,
            lastMessage: null
        });

        ctx.data.conversations.push(conversation);
        ctx.save();

        const response = {
            id: conversation.id,
            name: conversation.name,
            isGroup: !!conversation.isGroup,
            members: conversation.members.map(member => {
                const memberUser = ctx.data.users.find(u => u.id === member.userId);
                return {
                    userId: member.userId,
                    userName: memberUser ? memberUser.userName : "",
                    displayName: memberUser ? memberUser.displayName : "",
                    role: member.role
                };
            })
        };
        return ctx.json(res, 200, response);
    };
}

function addMember(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const chatId = req.params.id;
        const chat = ctx.data.conversations.find(c => c.id === chatId);
        if (!chat) return ctx.notFound(res, "Chat not found.");
        if (!chat.participants.includes(user.id)) {
            return ctx.unauthorized(res, "You are not a member of this chat.");
        }
        const body = req.body || {};
        const targetId = (body.userId || "").trim();
        const role = (body.role || "Member").trim() || "Member";
        const targetUser = ctx.data.users.find(u => u.id === targetId);
        if (!targetUser) return ctx.notFound(res, "User not found.");
        if (!chat.participants.includes(targetId)) {
            chat.participants.push(targetId);
            chat.members.push({ userId: targetId, role });
            ctx.save();
        }
        return ctx.noContent(res);
    };
}

function listMessages(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const chatId = req.params.id;
        const chat = ctx.data.conversations.find(c => c.id === chatId);
        if (!chat) return ctx.notFound(res, "Chat not found.");
        if (!chat.participants.includes(user.id)) {
            return ctx.unauthorized(res, "You are not a member of this chat.");
        }
        const messages = ctx.data.messages
            .filter(m => m.chatId === chatId)
            .map(m => ({
                id: m.id,
                chatId: m.chatId,
                senderId: m.senderId,
                senderName: m.senderName,
                content: m.content,
                sentAt: m.timestamp,
                attachments: m.attachments || []
            }));
        return ctx.json(res, 200, messages);
    };
}

function sendMessage(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const chatId = req.params.id;
        const chat = ctx.data.conversations.find(c => c.id === chatId);
        if (!chat) return ctx.notFound(res, "Chat not found.");
        if (!chat.participants.includes(user.id)) {
            return ctx.unauthorized(res, "You are not a member of this chat.");
        }
        const body = req.body || {};
        const content = (body.content || "").trim();
        if (!content) return ctx.badRequest(res, "Message content is required.");

        const receiverId = chat.participants.find(id => id !== user.id) || null;
        const message = new Message({
            id: ctx.newId(),
            senderId: user.id,
            receiverId,
            chatId,
            content,
            timestamp: new Date().toISOString()
        });
        message.senderName = user.displayName || user.userName;
        message.attachments = Array.isArray(body.attachments) ? body.attachments : [];

        ctx.data.messages.push(message);
        chat.lastMessage = message.id;
        ctx.save();

        return ctx.json(res, 200, {
            id: message.id,
            chatId: message.chatId,
            senderId: message.senderId,
            senderName: message.senderName,
            content: message.content,
            sentAt: message.timestamp,
            attachments: message.attachments
        });
    };
}

module.exports = {
    listChats,
    createChat,
    addMember,
    listMessages,
    sendMessage
};
