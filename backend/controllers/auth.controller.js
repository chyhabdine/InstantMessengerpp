function register(ctx) {
    return async (req, res) => {
        try {
            const body = req.body || {};
            const email = (body.email || "").trim();
            const password = (body.password || "").trim();
            const userName = (body.userName || "").trim() || email.split("@")[0];
            const displayName = (body.displayName || "").trim() || userName;
            const deviceName = (body.deviceName || "").trim();

            if (!email || !password) {
                return ctx.badRequest(res, "Email and password are required.");
            }

            const token = await ctx.services.auth.register({
                email,
                password,
                userName,
                displayName,
                deviceName
            });
            return ctx.json(res, 200, { accessToken: token });
        } catch (err) {
            if (err.message === "Email is already in use." || err.message === "Username is already in use.") {
                return ctx.conflict(res, err.message);
            }
            return ctx.badRequest(res, err.message || "Registration failed.");
        }
    };
}

function login(ctx) {
    return async (req, res) => {
        try {
            const body = req.body || {};
            const email = (body.email || "").trim();
            const password = (body.password || "").trim();
            const deviceName = (body.deviceName || "").trim();

            if (!email || !password) {
                return ctx.badRequest(res, "Email and password are required.");
            }

            const token = await ctx.services.auth.login({ email, password, deviceName });
            return ctx.json(res, 200, { accessToken: token });
        } catch (err) {
            if (err.message === "Invalid email or password.") {
                return ctx.unauthorized(res, err.message);
            }
            return ctx.badRequest(res, err.message || "Login failed.");
        }
    };
}

module.exports = {
    register,
    login
};
