const authController = require("../controllers/auth.controller");

function registerAuthRoutes(router, ctx) {
    router.add("POST", "/api/auth/register", authController.register(ctx));
    router.add("POST", "/api/auth/login", authController.login(ctx));
}

module.exports = registerAuthRoutes;
