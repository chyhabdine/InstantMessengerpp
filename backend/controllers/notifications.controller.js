function listNotifications(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const notifications = await ctx.services.notifications.list(user.id);
        return ctx.json(res, 200, notifications);
    };
}

function createNotification(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const body = req.body || {};
        if (!body.userId || !body.type) {
            return ctx.badRequest(res, "User id and type are required.");
        }
        const notification = await ctx.services.notifications.create(body.userId, body);
        if (!notification) return ctx.notFound(res, "User not found.");
        return ctx.json(res, 200, notification);
    };
}

function updateNotification(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        try {
            const notification = await ctx.services.notifications.update(user.id, req.params.id, req.body || {});
            if (!notification) return ctx.notFound(res, "Notification not found.");
            return ctx.json(res, 200, notification);
        } catch (err) {
            if (err.code === "FORBIDDEN") {
                return ctx.unauthorized(res, "You are not allowed to update this notification.");
            }
            return ctx.badRequest(res, "Unable to update notification.");
        }
    };
}

function deleteNotification(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        try {
            const notification = await ctx.services.notifications.remove(user.id, req.params.id);
            if (!notification) return ctx.notFound(res, "Notification not found.");
            return ctx.noContent(res);
        } catch (err) {
            if (err.code === "FORBIDDEN") {
                return ctx.unauthorized(res, "You are not allowed to delete this notification.");
            }
            return ctx.badRequest(res, "Unable to delete notification.");
        }
    };
}

module.exports = {
    listNotifications,
    createNotification,
    updateNotification,
    deleteNotification
};
