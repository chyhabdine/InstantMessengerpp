const crypto = require("crypto");
const User = require("../models/User");

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
}

function createPasswordHash(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    return { salt, hash };
}

function verifyPassword(password, salt, hash) {
    const check = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(check, "hex"), Buffer.from(hash, "hex"));
}

function register(ctx) {
    return (req, res) => {
        const body = req.body || {};
        const email = (body.email || "").trim();
        const password = (body.password || "").trim();
        const userName = (body.userName || "").trim() || email.split("@")[0];
        const displayName = (body.displayName || "").trim() || userName;

        if (!email || !password) {
            return ctx.badRequest(res, "Email and password are required.");
        }
        if (ctx.data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return ctx.conflict(res, "Email is already in use.");
        }
        if (ctx.data.users.some(u => u.userName.toLowerCase() === userName.toLowerCase())) {
            return ctx.conflict(res, "Username is already in use.");
        }

        const passwordData = createPasswordHash(password);
        const user = new User({
            id: ctx.newId(),
            email,
            userName,
            displayName,
            passwordHash: passwordData.hash,
            passwordSalt: passwordData.salt,
            statusMessage: "",
            presence: "Online",
            role: "User",
            avatarUrl: ""
        });

        ctx.data.users.push(user);
        ctx.save();

        const token = ctx.newId();
        ctx.tokens.set(token, user.id);
        return ctx.json(res, 200, { accessToken: token });
    };
}

function login(ctx) {
    return (req, res) => {
        const body = req.body || {};
        const email = (body.email || "").trim();
        const password = (body.password || "").trim();

        const user = ctx.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return ctx.unauthorized(res, "Invalid email or password.");
        }
        if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
            return ctx.unauthorized(res, "Invalid email or password.");
        }

        const token = ctx.newId();
        ctx.tokens.set(token, user.id);
        return ctx.json(res, 200, { accessToken: token });
    };
}

module.exports = {
    register,
    login
};
