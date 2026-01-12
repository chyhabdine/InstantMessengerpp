class Conversation {
    constructor({ id, name, isGroup, participants, members, lastMessage }) {
        this.id = id;
        this.name = name;
        this.isGroup = isGroup;
        this.participants = participants;
        this.members = members;
        this.lastMessage = lastMessage;
    }
}

module.exports = Conversation;
