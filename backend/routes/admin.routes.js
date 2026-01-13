const adminController = require("../controllers/admin.controller");

function registerAdminRoutes(router, ctx) {
    router.add("GET", "/api/admin/:entity", adminController.listEntities(ctx));
    router.add("GET", "/api/admin/:entity/:id", adminController.getEntity(ctx));
    router.add("POST", "/api/admin/:entity", adminController.createEntity(ctx));
    router.add("PUT", "/api/admin/:entity/:id", adminController.updateEntity(ctx));
    router.add("DELETE", "/api/admin/:entity/:id", adminController.deleteEntity(ctx));
}

module.exports = registerAdminRoutes;
