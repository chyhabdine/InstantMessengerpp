class UserService {
    constructor({ userRepository }) {
        this.userRepository = userRepository;
    }

    async getProfile(userId) {
        return this.userRepository.findById(userId);
    }

    async updateProfile(userId, { displayName, avatarUrl, statusMessage, presence }) {
        return this.userRepository.updateProfile(userId, {
            displayName,
            avatarUrl,
            statusMessage,
            presence
        });
    }

    async search(term) {
        return this.userRepository.search(term);
    }
}

module.exports = UserService;
