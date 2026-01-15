function listReactions(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const messageId = req.params.id;
        try {
            const reactions = await ctx.services.reactions.listByMessage(user.id, messageId);
            if (!reactions) return ctx.notFound(res, "Message not found.");
            return ctx.json(res, 200, reactions);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to list reactions.");
        }
    };
}

function createReaction(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const messageId = req.params.id;
        const body = req.body || {};
        const emoji = (body.emoji || "").trim();
        if (!emoji) {
            return ctx.badRequest(res, "Emoji is required.");
        }
        try {
            const reaction = await ctx.services.reactions.upsert(user.id, messageId, emoji);
            if (!reaction) return ctx.notFound(res, "Message not found.");
            return ctx.json(res, 200, reaction);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to create reaction.");
        }
    };
}

function updateReaction(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const reactionId = req.params.id;
        const emoji = (req.body?.emoji || "").trim();
        if (!emoji) {
            return ctx.badRequest(res, "Emoji is required.");
        }
        try {
            const reaction = await ctx.services.reactions.update(user.id, reactionId, emoji);
            if (!reaction) return ctx.notFound(res, "Reaction not found.");
            return ctx.json(res, 200, reaction);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to update reaction.");
        }
    };
}

function deleteReaction(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const reactionId = req.params.id;
        try {
            const reaction = await ctx.services.reactions.remove(user.id, reactionId);
            if (!reaction) return ctx.notFound(res, "Reaction not found.");
            return ctx.noContent(res);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to delete reaction.");
        }
    };
}

module.exports = {
    listReactions,
    createReaction,
    updateReaction,
    deleteReaction
};
