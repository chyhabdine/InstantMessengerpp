const messagesController = require("../controllers/messages.controller");

function registerMessageRoutes(router, ctx) {
    router.add("GET", "/api/chats", messagesController.listChats(ctx));
    router.add("POST", "/api/chats", messagesController.createChat(ctx));
    router.add("POST", "/api/chats/:id/members", messagesController.addMember(ctx));
    router.add("GET", "/api/chats/:id/messages", messagesController.listMessages(ctx));
    router.add("POST", "/api/chats/:id/messages", messagesController.sendMessage(ctx));
}

module.exports = registerMessageRoutes;
