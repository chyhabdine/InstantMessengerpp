class User {
    constructor({
        id,
        userName,
        email,
        passwordHash,
        passwordSalt,
        displayName,
        statusMessage,
        presence,
        role,
        avatarUrl
    }) {
        this.id = id;
        this.userName = userName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.passwordSalt = passwordSalt;
        this.displayName = displayName;
        this.statusMessage = statusMessage;
        this.presence = presence;
        this.role = role;
        this.avatarUrl = avatarUrl;
    }
}

module.exports = User;
