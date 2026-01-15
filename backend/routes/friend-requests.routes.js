const friendRequestsController = require("../controllers/friend-requests.controller");

function registerFriendRequestRoutes(router, ctx) {
    router.add("GET", "/api/friends/requests", friendRequestsController.listRequests(ctx));
    router.add("POST", "/api/friends/requests", friendRequestsController.createRequest(ctx));
    router.add("PUT", "/api/friends/requests/:id", friendRequestsController.updateRequest(ctx));
    router.add("DELETE", "/api/friends/requests/:id", friendRequestsController.deleteRequest(ctx));
}

module.exports = registerFriendRequestRoutes;
