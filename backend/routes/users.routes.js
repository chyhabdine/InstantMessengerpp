const usersController = require("../controllers/users.controller");

function registerUserRoutes(router, ctx) {
    router.add("GET", "/api/users/me", usersController.getMe(ctx));
    router.add("PUT", "/api/users/me/profile", usersController.updateProfile(ctx));
    router.add("GET", "/api/users", usersController.searchUsers(ctx));
}

module.exports = registerUserRoutes;
