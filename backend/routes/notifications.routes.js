const notificationsController = require("../controllers/notifications.controller");

function registerNotificationRoutes(router, ctx) {
    router.add("GET", "/api/notifications", notificationsController.listNotifications(ctx));
    router.add("POST", "/api/notifications", notificationsController.createNotification(ctx));
    router.add("PUT", "/api/notifications/:id", notificationsController.updateNotification(ctx));
    router.add("DELETE", "/api/notifications/:id", notificationsController.deleteNotification(ctx));
}

module.exports = registerNotificationRoutes;
