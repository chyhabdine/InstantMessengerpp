class Message {
    constructor({ id, senderId, receiverId, chatId, content, timestamp }) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.chatId = chatId;
        this.content = content;
        this.timestamp = timestamp;
    }
}

module.exports = Message;
