function listEntities(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const entity = req.params.entity;
        const items = await ctx.services.admin.list(entity);
        if (!items) {
            return ctx.notFound(res, "Entity not found.");
        }
        return ctx.json(res, 200, items);
    };
}

function getEntity(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const entity = req.params.entity;
        const item = await ctx.services.admin.get(entity, req.params.id);
        if (!item) {
            return ctx.notFound(res, "Record not found.");
        }
        return ctx.json(res, 200, item);
    };
}

function createEntity(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const entity = req.params.entity;
        try {
            const item = await ctx.services.admin.create(entity, req.body || {});
            if (!item) {
                return ctx.notFound(res, "Entity not found.");
            }
            return ctx.json(res, 200, item);
        } catch (err) {
            return ctx.badRequest(res, err.message || "Create failed.");
        }
    };
}

function updateEntity(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const entity = req.params.entity;
        try {
            const item = await ctx.services.admin.update(entity, req.params.id, req.body || {});
            if (!item) {
                return ctx.notFound(res, "Record not found.");
            }
            return ctx.json(res, 200, item);
        } catch (err) {
            return ctx.badRequest(res, err.message || "Update failed.");
        }
    };
}

function deleteEntity(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const entity = req.params.entity;
        const item = await ctx.services.admin.remove(entity, req.params.id);
        if (!item) {
            return ctx.notFound(res, "Record not found.");
        }
        return ctx.noContent(res);
    };
}

module.exports = {
    listEntities,
    getEntity,
    createEntity,
    updateEntity,
    deleteEntity
};
