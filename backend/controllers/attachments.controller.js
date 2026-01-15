function listAttachments(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const messageId = req.params.id;
        try {
            const attachments = await ctx.services.attachments.listByMessage(user.id, messageId);
            if (!attachments) return ctx.notFound(res, "Message not found.");
            return ctx.json(res, 200, attachments);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to list attachments.");
        }
    };
}

function createAttachment(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const messageId = req.params.id;
        const body = req.body || {};
        if (!body.url) {
            return ctx.badRequest(res, "Attachment url is required.");
        }
        try {
            const attachment = await ctx.services.attachments.create(user.id, messageId, body);
            if (!attachment) return ctx.notFound(res, "Message not found.");
            return ctx.json(res, 200, attachment);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to create attachment.");
        }
    };
}

function updateAttachment(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const attachmentId = req.params.id;
        try {
            const attachment = await ctx.services.attachments.update(user.id, attachmentId, req.body || {});
            if (!attachment) return ctx.notFound(res, "Attachment not found.");
            return ctx.json(res, 200, attachment);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to update attachment.");
        }
    };
}

function deleteAttachment(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const attachmentId = req.params.id;
        try {
            const attachment = await ctx.services.attachments.remove(user.id, attachmentId);
            if (!attachment) return ctx.notFound(res, "Attachment not found.");
            return ctx.noContent(res);
        } catch (err) {
            if (err.code === "NOT_A_MEMBER") {
                return ctx.unauthorized(res, "You are not a member of this chat.");
            }
            return ctx.badRequest(res, "Unable to delete attachment.");
        }
    };
}

module.exports = {
    listAttachments,
    createAttachment,
    updateAttachment,
    deleteAttachment
};
