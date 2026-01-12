function getMe(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        return ctx.json(res, 200, ctx.sanitizeProfile(user));
    };
}

function updateProfile(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const body = req.body || {};
        user.displayName = (body.displayName || "").trim() || user.displayName;
        user.avatarUrl = (body.avatarUrl || "").trim();
        user.statusMessage = (body.statusMessage || "").trim();
        user.presence = body.presence || user.presence;
        ctx.save();
        return ctx.json(res, 200, ctx.sanitizeProfile(user));
    };
}

function searchUsers(ctx) {
    return (req, res) => {
        const user = ctx.getAuthUser(req, res);
        if (!user) return;
        const term = (req.query.search || "").toLowerCase();
        const users = ctx.data.users
            .filter(u => !term || u.email.toLowerCase().includes(term) || u.userName.toLowerCase().includes(term))
            .map(u => ({
                userId: u.id,
                email: u.email,
                userName: u.userName,
                displayName: u.displayName
            }));
        return ctx.json(res, 200, users);
    };
}

module.exports = {
    getMe,
    updateProfile,
    searchUsers
};
