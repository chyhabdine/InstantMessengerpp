function listRequests(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const requests = await ctx.services.friendRequests.list(user.id);
        return ctx.json(res, 200, requests);
    };
}

function createRequest(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const receiverId = (req.body?.receiverId || "").trim();
        if (!receiverId) {
            return ctx.badRequest(res, "Receiver id is required.");
        }
        try {
            const request = await ctx.services.friendRequests.create(user.id, receiverId);
            if (!request) return ctx.notFound(res, "Receiver not found.");
            return ctx.json(res, 200, request);
        } catch (err) {
            return ctx.badRequest(res, err.message || "Unable to create request.");
        }
    };
}

function updateRequest(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const status = (req.body?.status || "").trim();
        if (!status) {
            return ctx.badRequest(res, "Status is required.");
        }
        try {
            const request = await ctx.services.friendRequests.update(user.id, req.params.id, status);
            if (!request) return ctx.notFound(res, "Request not found.");
            return ctx.json(res, 200, request);
        } catch (err) {
            if (err.message === "FORBIDDEN") {
                return ctx.unauthorized(res, "You are not allowed to update this request.");
            }
            return ctx.badRequest(res, err.message || "Unable to update request.");
        }
    };
}

function deleteRequest(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        try {
            const request = await ctx.services.friendRequests.remove(user.id, req.params.id);
            if (!request) return ctx.notFound(res, "Request not found.");
            return ctx.noContent(res);
        } catch (err) {
            if (err.message === "FORBIDDEN") {
                return ctx.unauthorized(res, "You are not allowed to delete this request.");
            }
            return ctx.badRequest(res, err.message || "Unable to delete request.");
        }
    };
}

module.exports = {
    listRequests,
    createRequest,
    updateRequest,
    deleteRequest
};
