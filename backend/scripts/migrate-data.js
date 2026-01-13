const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { initDatabase, models } = require("../config/database");

const dataPath = path.join(__dirname, "..", "data.json");

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
}

function normalizeUsers(rawUsers) {
    return rawUsers.map(user => {
        if (user.passwordHash && user.passwordSalt) {
            return user;
        }
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = hashPassword(user.password || "ChangeMe123", salt);
        return {
            ...user,
            passwordHash: hash,
            passwordSalt: salt
        };
    });
}

async function migrateUsers(users) {
    for (const user of users) {
        const userDefaults = {
            userName: user.userName || user.email.split("@")[0],
            email: user.email,
            passwordHash: user.passwordHash,
            passwordSalt: user.passwordSalt,
            displayName: user.displayName || user.userName || user.email,
            statusMessage: user.statusMessage || "",
            presence: user.presence || "Online",
            role: user.role || "User",
            avatarUrl: user.avatarUrl || ""
        };
        if (user.id) {
            userDefaults.id = user.id;
        }
        await models.User.findOrCreate({
            where: { email: user.email },
            defaults: userDefaults
        });
        await models.UserProfile.findOrCreate({
            where: { userId: user.id },
            defaults: {
                userId: user.id,
                displayName: user.displayName || user.userName || user.email,
                statusMessage: user.statusMessage || "",
                presence: user.presence || "Online",
                avatarUrl: user.avatarUrl || ""
            }
        });
    }
}

async function migrateConversations(conversations) {
    for (const conversation of conversations) {
        if (!conversation.id) continue;
        const convoDefaults = {
            name: conversation.name || "Conversation",
            isGroup: !!conversation.isGroup,
            lastMessageId: conversation.lastMessageId || null
        };
        convoDefaults.id = conversation.id;
        await models.Conversation.findOrCreate({
            where: { id: conversation.id },
            defaults: convoDefaults
        });

        if (Array.isArray(conversation.members)) {
            for (const member of conversation.members) {
                await models.ChatMember.findOrCreate({
                    where: {
                        conversationId: conversation.id,
                        userId: member.userId
                    },
                    defaults: {
                        conversationId: conversation.id,
                        userId: member.userId,
                        role: member.role || "Member"
                    }
                });
            }
        }
    }
}

async function migrateMessages(messages) {
    for (const message of messages) {
        const conversationId = message.chatId || message.conversationId;
        if (!message.id || !conversationId) continue;
        await models.Message.findOrCreate({
            where: { id: message.id },
            defaults: {
                id: message.id,
                senderId: message.senderId,
                receiverId: message.receiverId || null,
                conversationId,
                content: message.content || "",
                timestamp: message.sentAt ? new Date(message.sentAt) : new Date()
            }
        });
    }
}

async function main() {
    if (!fs.existsSync(dataPath)) {
        console.log("No data.json found, nothing to migrate.");
        return;
    }

    const raw = fs.readFileSync(dataPath, "utf8");
    const parsed = raw ? JSON.parse(raw) : {};
    const users = normalizeUsers(Array.isArray(parsed.users) ? parsed.users : []);
    const conversations = Array.isArray(parsed.conversations) ? parsed.conversations : [];
    const messages = Array.isArray(parsed.messages) ? parsed.messages : [];

    await initDatabase();
    await migrateUsers(users);
    await migrateConversations(conversations);
    await migrateMessages(messages);

    console.log("Data migration completed.");
}

main().catch(err => {
    console.error("Data migration failed:", err.message);
    process.exit(1);
});
