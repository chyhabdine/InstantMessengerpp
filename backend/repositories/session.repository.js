class SessionRepository {
    constructor(models) {
        this.Session = models.Session;
    }

    async create(sessionData) {
        return this.Session.create(sessionData);
    }

    async findByTokenHash(tokenHash) {
        return this.Session.findOne({ where: { tokenHash } });
    }
}

module.exports = SessionRepository;
