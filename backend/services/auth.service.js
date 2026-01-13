const crypto = require("crypto");

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

function tokenHash(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

class AuthService {
    constructor({ userRepository, sessionRepository, deviceRepository }) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
        this.deviceRepository = deviceRepository;
    }

    async register({ email, password, userName, displayName, deviceName }) {
        const existingEmail = await this.userRepository.findByEmailInsensitive(email);
        if (existingEmail) {
            throw new Error("Email is already in use.");
        }
        const existingUserName = await this.userRepository.findByUserNameInsensitive(userName);
        if (existingUserName) {
            throw new Error("Username is already in use.");
        }

        const passwordData = createPasswordHash(password);
        const user = await this.userRepository.create({
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

        return this.createSession(user, deviceName);
    }

    async login({ email, password, deviceName }) {
        const user = await this.userRepository.findByEmailInsensitive(email);
        if (!user) {
            throw new Error("Invalid email or password.");
        }
        if (!verifyPassword(password, user.passwordSalt, user.passwordHash)) {
            throw new Error("Invalid email or password.");
        }
        return this.createSession(user, deviceName);
    }

    async createSession(user, deviceName) {
        const token = crypto.randomUUID();
        const hash = tokenHash(token);
        const device = deviceName ? await this.deviceRepository.create(user.id, deviceName) : null;
        await this.sessionRepository.create({
            userId: user.id,
            deviceId: device ? device.id : null,
            tokenHash: hash,
            createdAt: new Date(),
            expiresAt: null
        });
        return token;
    }

    async getUserByToken(token) {
        const hash = tokenHash(token);
        const session = await this.sessionRepository.findByTokenHash(hash);
        if (!session) return null;
        return this.userRepository.findById(session.userId);
    }
}

module.exports = AuthService;
