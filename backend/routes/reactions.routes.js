const reactionsController = require("../controllers/reactions.controller");

function registerReactionRoutes(router, ctx) {
    router.add("GET", "/api/messages/:id/reactions", reactionsController.listReactions(ctx));
    router.add("POST", "/api/messages/:id/reactions", reactionsController.createReaction(ctx));
    router.add("PUT", "/api/reactions/:id", reactionsController.updateReaction(ctx));
    router.add("DELETE", "/api/reactions/:id", reactionsController.deleteReaction(ctx));
}

module.exports = registerReactionRoutes;
