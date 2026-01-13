function getMe(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        return ctx.json(res, 200, ctx.sanitizeProfile(user));
    };
}

function updateProfile(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const body = req.body || {};
        const updated = await ctx.services.users.updateProfile(user.id, {
            displayName: (body.displayName || "").trim() || user.displayName,
            avatarUrl: (body.avatarUrl || "").trim(),
            statusMessage: (body.statusMessage || "").trim(),
            presence: body.presence || user.presence
        });
        return ctx.json(res, 200, ctx.sanitizeProfile(updated));
    };
}

function searchUsers(ctx) {
    return async (req, res) => {
        const user = await ctx.getAuthUser(req, res);
        if (!user) return;
        const term = (req.query.search || "").toLowerCase();
        const users = await ctx.services.users.search(term);
        const results = users.map(u => ({
            userId: u.id,
            email: u.email,
            userName: u.userName,
            displayName: u.displayName
        }));
        return ctx.json(res, 200, results);
    };
}

module.exports = {
    getMe,
    updateProfile,
    searchUsers
};
